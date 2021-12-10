import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PackageDto } from '../DTOs/package.dto';
import { PackageDtoAdapter } from '../DTOs/package.dto.adapter';
import { PackageRouteResponseModel } from '../models/packageRoute.response.model';
import { PackageValidateRequestModel } from '../models/packageValidate.request.model';
import { CourierService } from '../courier/courier.service';
import { PackageForUserResponse } from '../models/packageForUser.response.model';
import { Position } from '../models/position.model';
import { Package, PackageDocument } from '../schemas/package.schema';
import { DatabaseService } from '../shared/database.service';
import { RouteService } from '../shared/route.service';
import { UserService } from '../user/user.service';
import { CourierDtoAdapter } from '../DTOs/courier.dto.adapter';
import { createMockString } from '../mocks/utilities';

@Injectable()
export class PackageService {
  constructor(
    @InjectModel(Package.name)
    private packageModel: Model<PackageDocument>,
    private databaseService: DatabaseService,
    @Inject(forwardRef(() => CourierService))
    private courierService: CourierService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => RouteService))
    private routeService: RouteService,
  ) { }

  async addUpdatePackage(packageInput: Package): Promise<void> {
    const packageSchema = await this.packageModel.findOne({ "packageNumber": packageInput.packageNumber });
    const newId = packageSchema ? packageSchema._id : createMockString();
    if (process.env.NODE_ENV === 'development') {
      this.databaseService.addUpdateItemCollection(
        'packages',
        newId,
        packageInput
      );
    }

    try {
      const packageModel = await this.packageModel.findOne({ "packageNumber": packageInput.packageNumber });
      await packageModel.updateOne(packageInput);
      await packageModel.save();
    } catch (e) {
      const createdPackage = new this.packageModel(
        packageInput
      );
      await createdPackage.save();
    }
  }

  async getPackages(): Promise<PackageDto[]> {
    const packageModels = await this.packageModel.find().exec();
    const packageDtos = await Promise.all(packageModels.map(async (p) => {
      const sender = await this.userService.getUser(p.sender);
      const receiver = await this.userService.getUser(p.receiver);
      return PackageDtoAdapter.toDto(p._id, p, sender, receiver);
    }));
    return packageDtos;
  }

  async getPackage(id: string): Promise<PackageDto> {
    const packageModel = await this.packageModel.findById(id);
    const sender = await this.userService.getUser(packageModel.sender);
    const receiver = await this.userService.getUser(packageModel.receiver);
    return PackageDtoAdapter.toDto(packageModel._id, packageModel, sender, receiver);
  }

  async validatePackage(requestModel: PackageValidateRequestModel): Promise<string[]> {
    const errors: string[] = [];
    if (
      requestModel.id.length === 0 ||
      requestModel.id == null ||
      requestModel.packageNumber.length === 0 ||
      requestModel.packageNumber == null ||
      requestModel.position.latitude === 0 ||
      requestModel.position.latitude == null ||
      requestModel.position.longitude === 0 ||
      requestModel.position.longitude == null ||
      requestModel.receiver.length === 0 ||
      requestModel.receiver == null ||
      requestModel.sender.length === 0 ||
      requestModel.sender == null ||
      requestModel.sendDate.length === 0 ||
      requestModel.sendDate == null ||
      requestModel.status.length === 0 ||
      requestModel.status == null
    ) {
      errors.push('Nie wszystkie pola są uzupełnione');
      return errors;
    }
    const packages = await this.getPackages();
    const couriers = await this.courierService.getCouriers();
    if (packages.some((p) => p.id === requestModel.id))
      errors.push('Ten numer id przesyłki jest już w systemie');
    if (packages.some((p) => p.packageNumber === requestModel.packageNumber))
      errors.push('Ten numer przesyłki już jest w systemie');
    if (
      !(
        new Date(requestModel.sendDate).setHours(0, 0, 0, 0) <=
        new Date().setHours(0, 0, 0, 0)
      )
    )
      errors.push('Data nadania nie może być późniejsza niż dzisiaj');
    let isInRegions = false;

    couriers.forEach((c) => {
      const zone = {
        leftTop: c.region.leftTop,
        leftBottom: c.region.leftBottom,
        rightTop: c.region.rightTop,
        rightBottom: c.region.rightBottom,
      };
      if (this.checkIfPointInCoords(zone, requestModel.position))
        isInRegions = true;
    });
    if (!isInRegions)
      errors.push('Paczka znajduje się poza obsługiwanym regionem');
    return errors;
  }

  async getRouteForPackage(id: string): Promise<PackageRouteResponseModel> {
    const packageRoute: Position[] = [];
    let courierId: string = '';
    const packageModel = await this.getPackage(id);
    const couriers = await this.courierService.getCouriers();
    couriers.forEach((c) => {
      if (c.currentPackages !== null && c.currentPackages.id === id) {
        courierId = c.employeeNumber;
        packageRoute.push(c.startPosition);
      }
      c.undeliveredPackages.forEach((p) => {
        if (p.id === id) {
          courierId = c.employeeNumber;
          packageRoute.push(c.startPosition);
        }
      })
    });
    packageRoute.push(packageModel.position);

    return {
      courierId,
      positions: packageRoute
    };
  }

  async getPackagesForSender(id: string): Promise<PackageForUserResponse[]> {
    const packages = await this.getPackages();
    const packagesForSender = packages.filter((p) => p.sender.id === id);
    return await this.getPackagesToResponsesModels(packagesForSender);
  }

  async getPackagesForReceiver(id: string): Promise<PackageForUserResponse[]> {
    const packages = await this.getPackages();
    const packagesForReceiver = packages.filter((p) => p.receiver.id === id);
    return await this.getPackagesToResponsesModels(packagesForReceiver);
  }

  private async getPackagesToResponsesModels(packages: PackageDto[]): Promise<PackageForUserResponse[]> {
    const packageForUserResponses = [];
    const couriers = await this.courierService.getCouriers();
    await Promise.all(packages.map(async (p) => {
      let packageResponse = new PackageForUserResponse({
        package: PackageDtoAdapter.toPublicDto(p),
        courier: null,
        deliveryTime: null,
      })
      const courier = couriers.find((c) =>
        c.currentPackages?.id === p.id
        || c.undeliveredPackages?.some((up) => up.id === p.id));
      if (courier) {
        packageResponse.courier = CourierDtoAdapter.toPublicDto(courier);
        const directionsCalculation = await this.routeService.getDirections(courier.startPosition, [p.position]);
        const timeToPackage = directionsCalculation.positionsWithDistance[0].time;
        const time = new Date(Date.now());
        time.setSeconds(time.getSeconds() + timeToPackage);
        packageResponse.deliveryTime = `${time.getHours()}:${time.getMinutes()}`
      }
      packageForUserResponses.push(packageResponse);
    }));
    return packageForUserResponses;
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
}
