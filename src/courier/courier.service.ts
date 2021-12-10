import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourierDto } from '../DTOs/courier.dto';
import { CourierDtoAdapter } from '../DTOs/courier.dto.adapter';
import { CourierLoginDto } from '../DTOs/courierLogin.dto';
import { PackageDtoAdapter } from '../DTOs/package.dto.adapter';
import { PackageDtoPublic } from '../DTOs/package.dto.public';
import { PackageStatus } from '../models/packageStatus.enum';
import { CourierPackagesResponseModel } from '../models/courierPackages.response.model';
import { Direction } from '../models/direction.model';
import { PackageDistance } from '../models/packageDistance.model';
import { Position } from '../models/position.model';
import { PositionWithDistance } from '../models/positionWithDistance.model';
import { PackageService } from '../package/package.service';
import { Courier, CourierDocument } from '../schemas/courier.schema';
import { DatabaseService } from '../shared/database.service';
import { RouteService } from '../shared/route.service';
import { TokenResponse } from '../models/token.response.model';
import { AuthService } from '../shared/auth.service';
import { PackageDto } from 'src/DTOs/package.dto';

@Injectable()
export class CourierService {
  constructor(private databaseService: DatabaseService,
    @InjectModel(Courier.name) private courierModel: Model<CourierDocument>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @Inject(forwardRef(() => PackageService))
    private packageService: PackageService,
    @Inject(forwardRef(() => RouteService))
    private routeService: RouteService) { }

  async addUpdateCourier(courier: Courier): Promise<void> {
    try {
      const courierModel = await this.courierModel.findOne({ 'employeeNumber': courier.employeeNumber });
      await courierModel.updateOne(courier);
      await courierModel.save();
    } catch (e) {
      const createdCourier = new this.courierModel(courier);
      await createdCourier.save();
    }

    if (process.env.NODE_ENV === 'development') this.overrideCourierInFirebase(courier);

  }

  async getCouriers(): Promise<CourierDto[]> {
    const courierModels = await this.courierModel.find().exec();
    if (courierModels.length !== 0 && courierModels) {
      const courierDtos = await Promise.all(courierModels.map(async (c) => {
        const deliveredPackages = await Promise.all(c.deliveredPackages.map(async (p) => {
          if (p && p !== '') {
            return await this.packageService.getPackage(p)
          } else {
            return;
          }
        }
        ));
        const undeliveredPackages = await Promise.all(c.undeliveredPackages.map(async (p) => {
          if (p && p !== '') {
            return await this.packageService.getPackage(p)
          } else {
            return;
          }
        }
        ));
        const currentPackages = c.currentPackages && c.currentPackages !== ''
          ? await this.packageService.getPackage(c.currentPackages)
          : null;
        return CourierDtoAdapter.toDto(c._id, c, deliveredPackages, undeliveredPackages, currentPackages);
      }));
      return courierDtos;
    } else {
      return [];
    }

  }

  async setPackagesForCourier(employeeNumber: string)
    : Promise<CourierPackagesResponseModel> {
    const now = new Date();
    const startTime = `${now.getHours()}:${now.getMinutes()}`
    let courier = await this.getCourier(employeeNumber);
    const zone = {
      leftTop: courier.region.leftTop,
      leftBottom: courier.region.leftBottom,
      rightTop: courier.region.rightTop,
      rightBottom: courier.region.rightBottom
    };
    const packages = await this.packageService.getPackages();
    const packagesInZone = packages.filter((p) => this.checkIfPointInCoords(zone, p.position));
    const orderedPackages = packagesInZone.sort((a, b) => a.sendDate.getTime() - b.sendDate.getTime());
    const firstPackages = orderedPackages.slice(0, 25);
    const initPackage = firstPackages[0];
    const otherPackages = firstPackages.slice(1, 24);
    ///order by distance from OSRM (when server custom)
    if (process.env.NODE_ENV === 'production') {
      const positions = firstPackages.map((p) => p.position);
      const orderedPositions = await this.routeService.getOrder(courier.startPosition, positions);
      const orderedByPositionPackages = [];
      firstPackages.forEach((packageModel: PackageDto) => {
        orderedPositions.forEach((p: Position) => {
          if (p.latitude === packageModel.position.latitude && p.longitude === packageModel.position.longitude) {
            orderedByPositionPackages.push(packageModel);
          }
        })
      });
    }

    await this.packageService.addUpdatePackage(PackageDtoAdapter.toModel(initPackage));
    await Promise.all(otherPackages.map(async (p) => {
      await this.packageService.addUpdatePackage(PackageDtoAdapter.toModel(p));
    }));
    courier.currentPackages = initPackage;
    courier.deliveredPackages = [];
    courier.undeliveredPackages = otherPackages;
    courier.startTime = startTime;
    if (process.env.NODE_ENV === 'development')
      this.overrideCourierInFirebase(CourierDtoAdapter.toModel(courier));
    await this.addUpdateCourier(CourierDtoAdapter.toModel(courier));
    const directionsWithDistance = await this.routeService.getDirections(
      courier.startPosition,
      [
        courier.currentPackages.position,
        ...courier.undeliveredPackages.map((p) => p.position)
      ]);
    const packagesWithDistance = this.getDurationByPostion(directionsWithDistance, courier);
    return {
      packagesDistance: packagesWithDistance,
      directions: directionsWithDistance.directions,
    };
  }

  async getCourier(employeeNumber: string): Promise<CourierDto> {
    const courierModel = await this.courierModel.findOne({ "employeeNumber": employeeNumber });
    if (courierModel) {
      const deliveredPackages = await Promise.all(courierModel.deliveredPackages.map(async (p) => {
        if (p && p !== '') {
          return await this.packageService.getPackage(p)
        } else {
          return;
        }
      }
      ));
      const undeliveredPackages = await Promise.all(courierModel.undeliveredPackages.map(async (p) => {
        if (p && p !== '') {
          return await this.packageService.getPackage(p)
        } else {
          return;
        }
      }
      ));
      const currentPackages = courierModel.currentPackages && courierModel.currentPackages !== ''
        ? await this.packageService.getPackage(courierModel.currentPackages)
        : null;
      return CourierDtoAdapter.toDto(
        courierModel._id,
        courierModel,
        deliveredPackages,
        undeliveredPackages,
        currentPackages
      );
    } else {
      return null;
    }

  }

  async validateCourier(courier: Courier): Promise<string[]> {
    const errors: string[] = [];

    if (
      courier.employeeNumber.length === 0 ||
      courier.employeeNumber == null ||
      courier.password.length === 0 ||
      courier.password == null ||
      courier.vehicle.length === 0 ||
      courier.vehicle == null ||
      courier.startPosition.latitude === 0 ||
      courier.startPosition.longitude === 0 ||
      courier.registration.length === 0 ||
      courier.registration == null ||
      courier.region.leftBottom.latitude === 0 ||
      courier.region.leftBottom.longitude === 0 ||
      courier.region.leftTop.latitude === 0 ||
      courier.region.leftTop.longitude === 0 ||
      courier.region.name.length === 0 ||
      courier.region.name == null ||
      courier.region.rightBottom.latitude === 0 ||
      courier.region.rightBottom.longitude === 0 ||
      courier.region.rightTop.latitude === 0 ||
      courier.region.rightTop.longitude === 0 ||
      courier.phoneNumber === 0 ||
      courier.lastName.length === 0 ||
      courier.lastName == null ||
      courier.firstName.length === 0
    ) {
      errors.push('Nie wszystkie pola są uzupełnione');
      return errors;
    }
    const couriers = await this.getCouriers();
    if (couriers.some((c) => c.employeeNumber === courier.employeeNumber))
      errors.push('Ten numer kuriera już jest w systemie');
    if (couriers.some((c) => c.registration === courier.registration))
      errors.push('Ta rejestracja już jest w systemie');
    if (couriers.some((c) => c.phoneNumber === courier.phoneNumber))
      errors.push('Ten numer telefonu już jest w systemie');

    const isInRegion = this.checkIfPointInCoords(
      {
        leftTop: courier.region.leftTop,
        leftBottom: courier.region.leftBottom,
        rightTop: courier.region.rightTop,
        rightBottom: courier.region.rightBottom,
      },
      courier.startPosition,
    );
    if (!isInRegion) errors.push('Pozycja startowa poza strefą kuriera');

    couriers.forEach((otherCourier) => {
      const zone = {
        leftTop: otherCourier.region.leftTop,
        leftBottom: otherCourier.region.leftBottom,
        rightTop: otherCourier.region.rightTop,
        rightBottom: otherCourier.region.rightBottom,
      };
      if (
        this.checkIfPointInCoords(zone, courier.region.leftTop) ||
        this.checkIfPointInCoords(zone, courier.region.leftBottom) ||
        this.checkIfPointInCoords(zone, courier.region.rightTop) ||
        this.checkIfPointInCoords(zone, courier.region.rightBottom)
      )
        errors.push('Region kuriera pokrywa się z istniejącym');
    });

    return errors;
  }

  async getCourierRoute(employeeNumber: string): Promise<Position[]> {
    const route: Position[] = [];
    const courier = await this.getCourier(employeeNumber);
    if (courier) {
      if (courier.startPosition) {
        route.push(courier.startPosition);
      }
      if (courier.currentPackages) {
        route.push(courier.currentPackages.position);
      }
      if (courier.undeliveredPackages !== null) {
        courier.undeliveredPackages.forEach((p) => route.push(p.position))
      }
    }
    return route;
  }

  async loginCourier(data: CourierLoginDto): Promise<{ isLoginCorrect: boolean, tokens: TokenResponse }> {
    try {
      const courierModel = await this.courierModel.findOne({ "employeeNumber": data.login });
      if (courierModel.password === data.password) {
        return {
          isLoginCorrect: true,
          tokens: new TokenResponse({
            userToken: this.authService.generateJwt({ login: data.login, role: 'courier' }),
            mapToken: this.authService.generateJwt({ login: data.login, role: 'map' })
          })
        }
      } else {
        return {
          isLoginCorrect: false,
          tokens: {
            userToken: '',
            mapToken: ''
          }
        };
      }
    } catch (e) {
      return {
        isLoginCorrect: false,
        tokens: {
          userToken: '',
          mapToken: ''
        }
      };
    }
  }

  async updateCourierPosition(employeeNumber: string, position: Position)
    : Promise<CourierPackagesResponseModel> {
    let courier: CourierDto = await this.getCourier(employeeNumber);
    courier.startPosition = position;
    await this.addUpdateCourier(CourierDtoAdapter.toModel(courier));
    const directionsWithPositions = await this.routeService.getDirections(
      courier.startPosition,
      [
        courier.currentPackages.position,
        ...courier.undeliveredPackages.map((p) => p.position)
      ]);
    const packagesWithDistance = this.getDurationByPostion(directionsWithPositions, courier);
    this.sendMessage(directionsWithPositions, courier);
    return {
      packagesDistance: packagesWithDistance,
      directions: directionsWithPositions.directions
    };
  }

  private sendMessage(directionsWithPositions: { directions: Direction[]; positionsWithDistance: PositionWithDistance[]; }, courier: CourierDto) {
    const positionsToMessage = [courier.startPosition];
    directionsWithPositions.positionsWithDistance.map((pd: PositionWithDistance) => positionsToMessage.push(pd.position));
    [courier.currentPackages, ...courier.undeliveredPackages].forEach((p) => {
      const packagePositions = [courier.startPosition, p.position];
    });
  }

  async getPackagesForCourier(employeeNumber: string): Promise<PackageDtoPublic[]> {
    const courier: CourierDto = await this.getCourier(employeeNumber);
    return this.courierPackagesToPackagesPublicModel(courier);
  }

  async clearPackagesForCourier(employeeNumber: string): Promise<void> {
    let courier: CourierDto = await this.getCourier(employeeNumber);
    let currentPackage = courier.currentPackages;
    let deliveredPackages = [...courier.deliveredPackages];
    let undeliveredPackages = [...courier.undeliveredPackages];

    currentPackage.status = PackageStatus.waiting;
    await this.packageService.addUpdatePackage(PackageDtoAdapter.toModel(currentPackage));

    deliveredPackages.forEach((p) => {
      p.status = PackageStatus.delivered;
    });
    undeliveredPackages.forEach((p) => {
      p.status = PackageStatus.waiting;
    })
    Promise.all([...deliveredPackages, ...undeliveredPackages].map(async (p) => {
      await this.packageService.addUpdatePackage(PackageDtoAdapter.toModel(p));
    }));

    courier.currentPackages = null;
    courier.undeliveredPackages = [];
    courier.deliveredPackages = [];
    await this.addUpdateCourier(CourierDtoAdapter.toModel(courier));
  }

  async updatePackageStatus(employeeNumber: string, packageId: string, isDelivered: boolean): Promise<PackageDtoPublic[]> {
    let courier: CourierDto = await this.getCourier(employeeNumber);

    if (courier.currentPackages.id === packageId && courier.currentPackages !== null) {
      if (isDelivered) {
        courier.deliveredPackages.push(courier.currentPackages);
      }
      courier.currentPackages = courier.undeliveredPackages[0];
      courier.undeliveredPackages.shift();
      await this.addUpdateCourier(CourierDtoAdapter.toModel(courier));
    } else {
      if (isDelivered) {
        courier.deliveredPackages.push(
          courier.undeliveredPackages.find((p) => p.id === packageId)
        );
      }
      const undelivered = courier.undeliveredPackages.filter((p) => p.id !== packageId);
      courier.undeliveredPackages = undelivered;
      await this.addUpdateCourier(CourierDtoAdapter.toModel(courier));
    }
    return this.courierPackagesToPackagesPublicModel(courier);
  }

  private checkIfPointInCoords(
    coords: {
      leftTop: Position;
      leftBottom: Position;
      rightTop: Position;
      rightBottom: Position;
    },
    point: Position,
  ) {
    const closestLat = Math.min(
      coords.leftTop.latitude,
      coords.leftBottom.latitude,
      coords.rightBottom.latitude,
      coords.rightTop.latitude,
    );
    const farestLat = Math.max(
      coords.leftTop.latitude,
      coords.leftBottom.latitude,
      coords.rightBottom.latitude,
      coords.rightTop.latitude,
    );
    const closestLong = Math.min(
      coords.leftTop.longitude,
      coords.leftBottom.longitude,
      coords.rightBottom.longitude,
      coords.rightTop.longitude,
    );
    const farestLong = Math.max(
      coords.leftTop.longitude,
      coords.leftBottom.longitude,
      coords.rightBottom.longitude,
      coords.rightTop.longitude,
    );

    if (
      point.latitude <= closestLat ||
      point.latitude >= farestLat ||
      point.longitude <= closestLong ||
      point.longitude >= farestLong
    )
      return false;
    else return true;
  }

  private courierPackagesToPackagesPublicModel(courierDto: CourierDto)
    : PackageDtoPublic[] {
    const packages: PackageDtoPublic[] = [];
    if (courierDto.currentPackages)
      packages.push(PackageDtoAdapter.toPublicDto(courierDto.currentPackages));
    courierDto.undeliveredPackages.forEach((p) => {
      packages.push(PackageDtoAdapter.toPublicDto(p));
    });
    return packages;
  }

  private getDurationByPostion(
    directionsWithDistance: {
      directions: Direction[];
      positionsWithDistance: PositionWithDistance[];
    }, courier: CourierDto): PackageDistance[] {
    const packagesWithDistance: PackageDistance[] = [];
    directionsWithDistance.positionsWithDistance.forEach((pwd: PositionWithDistance) => {
      if (pwd.position.latitude === courier.currentPackages.position.latitude
        && pwd.position.longitude === courier.currentPackages.position.longitude) {
        packagesWithDistance.push({
          packageId: courier.currentPackages.id,
          distance: pwd.distance,
          time: pwd.time,
        });
      };
      courier.undeliveredPackages.forEach((p) => {
        if (p.position.latitude === pwd.position.latitude
          && p.position.longitude === pwd.position.longitude) {
          packagesWithDistance.push({
            packageId: p.id,
            distance: pwd.distance,
            time: pwd.time
          });
        };
      });
    });
    return packagesWithDistance;
  }

  private overrideCourierInFirebase(courier: Courier) {
    this.databaseService.addUpdateItemCollection(
      'couriers',
      courier.employeeNumber,
      courier,
    );
  }
}
