import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import {
    closeInMongoConnection,
    connectToDatabase,
    dropCollection,
    findOneInCollection,
    insertObjectIntoDatabase,
    rootMongooseTestModule
} from "../mocks/mongoTestModule";
import { PackageModule } from "../package/package.module";
import { PackageService } from "../package/package.service";
import { Courier, CourierSchema } from "../schemas/courier.schema";
import { createMockCourier } from "../schemas/courier.schema.mock";
import { Package, PackageSchema } from "../schemas/package.schema";
import { RouteService } from "../shared/route.service";
import { SharedModule } from "../shared/shared.module";
import { UserModule } from "../user/user.module";
import { CourierService } from "./courier.service"
import { Position } from "../models/position.model";
import { createMockNumber, createMockPackageStatus, createMockPosition, createMockString } from "../mocks/utilities";
import { createMockPackageDto } from "../DTOs/package.dto.mock";
import { createMockCourierLoginDto } from "../DTOs/courierLogin.dto.mock";
import { AuthService } from "../shared/auth.service";
import { createMockRegion } from "../models/region.model.mock";
import { createMockGetDirectionsResponseModel } from "../models/getDirectionsResponse.model.mock";
import { createMockUserDTO } from "../DTOs/user.dto.mock";

describe('CourierService', () => {
    let courierService: CourierService;
    let packageService: PackageService;
    let routeService: RouteService;
    let authService: AuthService;
    let someMockCourierId: string;
    let someMockCourier: Courier;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([
                    { name: Courier.name, schema: CourierSchema },
                    { name: Package.name, schema: PackageSchema }
                ]),
                SharedModule,
                PackageModule,
                UserModule
            ],
            providers: [CourierService]
        }).compile();

        courierService = app.get<CourierService>(CourierService);
        packageService = app.get<PackageService>(PackageService);
        routeService = app.get<RouteService>(RouteService);
        authService = app.get<AuthService>(AuthService);
        await connectToDatabase();
    });

    beforeEach(async () => {
        someMockCourier = createMockCourier();
        someMockCourierId = await insertObjectIntoDatabase(
            'couriers',
            CourierSchema,
            someMockCourier
        );
    });

    afterEach(async () => {
        await dropCollection('couriers');
        await closeInMongoConnection();
    });

    it('should be defined', () => {
        expect(courierService).toBeDefined();
    });

    it('should add courier', async () => {
        const someCourierToAdd = createMockCourier();

        await courierService.addUpdateCourier(someCourierToAdd);

        const result = await findOneInCollection('couriers', CourierSchema, 'employeeNumber', someCourierToAdd.employeeNumber);

        expect(result.employeeNumber).toEqual(someCourierToAdd.employeeNumber);
        expect(result.firstName).toEqual(someCourierToAdd.firstName);
        expect(result.lastName).toEqual(someCourierToAdd.lastName);
        expect(result.password).toEqual(someCourierToAdd.password);
        expect(result.phoneNumber).toEqual(someCourierToAdd.phoneNumber);
        expect(result.startPosition.latitude).toEqual(someCourierToAdd.startPosition.latitude);
        expect(result.startPosition.longitude).toEqual(someCourierToAdd.startPosition.longitude);
        expect(result.vehicle).toEqual(someCourierToAdd.vehicle);
        expect(result.registration).toEqual(someCourierToAdd.registration);
        expect(result.startTime).toEqual(someCourierToAdd.startTime);
        expect(result.region).toEqual(someCourierToAdd.region);
    });

    it('should update courier', async () => {
        const someNewPosition = new Position({
            longitude: 50,
            latitude: 20
        });
        const someNewVehicle = createMockString();
        const someNewRegistration = createMockString();
        const someNewFirstName = createMockString();
        const someUpdatedCourier = createMockCourier({
            employeeNumber: someMockCourier.employeeNumber,
            firstName: someNewFirstName,
            lastName: someMockCourier.lastName,
            password: someMockCourier.password,
            phoneNumber: someMockCourier.phoneNumber,
            startPosition: someNewPosition,
            vehicle: someNewVehicle,
            registration: someNewRegistration,
            startTime: someMockCourier.startTime,
            region: someMockCourier.region,
            deliveredPackages: [],
            undeliveredPackages: [],
            currentPackages: createMockString()
        });

        await courierService.addUpdateCourier(someUpdatedCourier);

        const result = await findOneInCollection('couriers', CourierSchema, 'employeeNumber', someMockCourier.employeeNumber);
        expect(result.employeeNumber).toEqual(someMockCourier.employeeNumber);
        expect(result.firstName).toEqual(someNewFirstName);
        expect(result.lastName).toEqual(someMockCourier.lastName);
        expect(result.password).toEqual(someMockCourier.password);
        expect(result.phoneNumber).toEqual(someMockCourier.phoneNumber);
        expect(result.startPosition.latitude).toEqual(someNewPosition.latitude);
        expect(result.startPosition.longitude).toEqual(someNewPosition.longitude);
        expect(result.vehicle).toEqual(someNewVehicle);
        expect(result.registration).toEqual(someNewRegistration);
        expect(result.startTime).toEqual(someMockCourier.startTime);
        expect(result.region).toEqual(someMockCourier.region);
    });

    it('should get couriers', async () => {
        const someMockPackage = createMockPackageDto();
        packageService.getPackage = jest.fn().mockResolvedValue(someMockPackage);

        const result = await courierService.getCouriers();

        expect(result).toEqual([{
            id: someMockCourierId,
            employeeNumber: someMockCourier.employeeNumber,
            firstName: someMockCourier.firstName,
            lastName: someMockCourier.lastName,
            password: someMockCourier.password,
            phoneNumber: someMockCourier.phoneNumber,
            startPosition: someMockCourier.startPosition,
            vehicle: someMockCourier.vehicle,
            registration: someMockCourier.registration,
            startTime: someMockCourier.startTime,
            region: someMockCourier.region,
            currentPackages: someMockPackage,
            undeliveredPackages: [someMockPackage],
            deliveredPackages: [someMockPackage]
        }]);
    });

    it('should get courier by id', async () => {
        const someMockPackage = createMockPackageDto();
        packageService.getPackage = jest.fn().mockResolvedValue(someMockPackage);

        const result = await courierService.getCourier(someMockCourier.employeeNumber);

        expect(result).toEqual({
            id: someMockCourierId,
            employeeNumber: someMockCourier.employeeNumber,
            firstName: someMockCourier.firstName,
            lastName: someMockCourier.lastName,
            password: someMockCourier.password,
            phoneNumber: someMockCourier.phoneNumber,
            startPosition: someMockCourier.startPosition,
            vehicle: someMockCourier.vehicle,
            registration: someMockCourier.registration,
            startTime: someMockCourier.startTime,
            region: someMockCourier.region,
            currentPackages: someMockPackage,
            undeliveredPackages: [someMockPackage],
            deliveredPackages: [someMockPackage]
        });
    });

    it('should set packages for courier', async () => {
        const someCurrentPackage = createMockPackageDto({
            id: createMockString(),
            packageNumber: createMockString(),
            sendDate: new Date(),
            receiver: createMockUserDTO(),
            sender: createMockUserDTO(),
            comments: createMockString(),
            status: createMockPackageStatus(),
            position: {
                latitude: 48.873748,
                longitude: 2.341049
            }
        }
        );
        const someUndeliveredPackage = createMockPackageDto();
        packageService.getPackages = jest.fn().mockResolvedValue([someCurrentPackage, someUndeliveredPackage]);
        packageService.getPackage = jest.fn().mockResolvedValue(someCurrentPackage);
        packageService.addUpdatePackage = jest.fn();
        const someMockCourier = createMockCourier({
            employeeNumber: createMockString(),
            firstName: createMockString(),
            lastName: createMockString(),
            password: createMockString(),
            phoneNumber: createMockNumber(),
            startPosition: {
                latitude: 48.8,
                longitude: 2.3
            },
            vehicle: createMockString(),
            registration: createMockString(),
            startTime: createMockString(),
            region: {
                name: createMockString(),
                leftTop: {
                    latitude: 48.963991,
                    longitude: 2.217370
                },
                leftBottom: {
                    latitude: 48.805055,
                    longitude: 2.121176
                },
                rightTop: {
                    latitude: 48.963991,
                    longitude: 2.489464
                },
                rightBottom: {
                    latitude: 48.796009,
                    longitude: 2.551303
                }
            },
            deliveredPackages: [someCurrentPackage.id],
            undeliveredPackages: [someCurrentPackage.id],
            currentPackages: someCurrentPackage.id,
        });
        const mockGetDirectionsResponseModel = createMockGetDirectionsResponseModel();
        routeService.getDirections = jest.fn().mockResolvedValue(mockGetDirectionsResponseModel);
        await insertObjectIntoDatabase('couriers', CourierSchema, someMockCourier);

        await courierService.setPackagesForCourier(someMockCourier.employeeNumber);

        const result = await findOneInCollection('couriers', CourierSchema, 'employeeNumber', someMockCourier.employeeNumber);
        expect(result.currentPackages).toEqual(someCurrentPackage.id);
    });

    it('should get courier', async () => {
        const someMockPackage = createMockPackageDto();
        packageService.getPackage = jest.fn().mockResolvedValue(someMockPackage);

        const result = await courierService.getCourier(someMockCourier.employeeNumber);

        expect(result).toEqual({
            id: someMockCourierId,
            employeeNumber: someMockCourier.employeeNumber,
            firstName: someMockCourier.firstName,
            lastName: someMockCourier.lastName,
            password: someMockCourier.password,
            phoneNumber: someMockCourier.phoneNumber,
            startPosition: someMockCourier.startPosition,
            vehicle: someMockCourier.vehicle,
            registration: someMockCourier.registration,
            startTime: someMockCourier.startTime,
            region: someMockCourier.region,
            currentPackages: someMockPackage,
            undeliveredPackages: [someMockPackage],
            deliveredPackages: [someMockPackage]
        })
    });

    it('should validate courier', async () => {
        const someMockPackage = createMockPackageDto();
        const someMockCourier = createMockCourier({
            employeeNumber: createMockString(),
            firstName: createMockString(),
            lastName: createMockString(),
            password: createMockString(),
            phoneNumber: createMockNumber(),
            startPosition: {
                latitude: 48.8,
                longitude: 2.3
            },
            vehicle: createMockString(),
            registration: createMockString(),
            startTime: createMockString(),
            region: {
                name: createMockString(),
                leftTop: {
                    latitude: 48.963991,
                    longitude: 2.217370
                },
                leftBottom: {
                    latitude: 48.805055,
                    longitude: 2.121176
                },
                rightTop: {
                    latitude: 48.963991,
                    longitude: 2.489464
                },
                rightBottom: {
                    latitude: 48.796009,
                    longitude: 2.551303
                }
            },
            deliveredPackages: [someMockPackage.id],
            undeliveredPackages: [someMockPackage.id],
            currentPackages: someMockPackage.id,
        });

        packageService.getPackage = jest.fn().mockResolvedValue(someMockPackage);

        const result = await courierService.validateCourier(someMockCourier);

        expect(result).toEqual([]);
    });

    it('should show error if courier exist in database', async () => {
        const someMockPackage = createMockPackageDto();
        const someMockCourierToValidate = createMockCourier({
            employeeNumber: someMockCourier.employeeNumber,
            firstName: createMockString(),
            lastName: createMockString(),
            password: createMockString(),
            phoneNumber: createMockNumber(),
            startPosition: {
                latitude: 48.8,
                longitude: 2.3
            },
            vehicle: createMockString(),
            registration: createMockString(),
            startTime: createMockString(),
            region: {
                name: createMockString(),
                leftTop: {
                    latitude: 48.963991,
                    longitude: 2.217370
                },
                leftBottom: {
                    latitude: 48.805055,
                    longitude: 2.121176
                },
                rightTop: {
                    latitude: 48.963991,
                    longitude: 2.489464
                },
                rightBottom: {
                    latitude: 48.796009,
                    longitude: 2.551303
                }
            },
            deliveredPackages: [someMockPackage.id],
            undeliveredPackages: [someMockPackage.id],
            currentPackages: someMockPackage.id,
        });

        packageService.getPackage = jest.fn().mockResolvedValue(someMockPackage);

        const result = await courierService.validateCourier(someMockCourierToValidate);

        expect(result).toContain('Ten numer kuriera już jest w systemie');
    });

    it('should get route for courier', async () => { });

    it('should login courier', async () => {
        const someMockCourierToLogin = createMockCourierLoginDto({
            login: someMockCourier.employeeNumber,
            password: someMockCourier.password
        });
        const someTokenString = createMockString();
        authService.generateJwt = jest.fn().mockReturnValue(someTokenString);

        const result = await courierService.loginCourier(someMockCourierToLogin);

        expect(result.tokens.userToken).toEqual(someTokenString);
        expect(result.tokens.mapToken).toEqual(someTokenString);
    });

    it('should update courier position', async () => {
        const someMockPosition = createMockPosition();
        const someMockPackage = createMockPackageDto();
        const someMockGetDirectionsResponseModel = createMockGetDirectionsResponseModel();
        routeService.getDirections = jest.fn().mockResolvedValue(someMockGetDirectionsResponseModel);
        packageService.addUpdatePackage = jest.fn().mockReturnValue(someMockPackage);
        packageService.getPackage = jest.fn().mockReturnValue(someMockPackage);

        await courierService.updateCourierPosition(someMockCourier.employeeNumber, someMockPosition);

        const result = await findOneInCollection('couriers', CourierSchema, 'employeeNumber', someMockCourier.employeeNumber);
        expect(result.startPosition).toEqual(someMockPosition);
    });

    it('should clear courier packages', async () => {
        packageService.getPackage = jest.fn().mockReturnValue(createMockPackageDto());
        packageService.addUpdatePackage = jest.fn();

        await courierService.clearPackagesForCourier(someMockCourier.employeeNumber);

        const result = await findOneInCollection('couriers', CourierSchema, 'employeeNumber', someMockCourier.employeeNumber);
        expect(result.currentPackages).toEqual(null);
        expect(result.undeliveredPackages).toEqual([]);
        expect(result.deliveredPackages).toEqual([]);
    });

    it('should update package status', async () => {
        const somePackageMock = createMockPackageDto();
        const someMockEmployeeNumber = createMockString();
        packageService.getPackage = jest.fn().mockReturnValue(somePackageMock);
        packageService.addUpdatePackage = jest.fn();
        const someMockCurierToUpdate = createMockCourier({
            employeeNumber: someMockEmployeeNumber,
            firstName: createMockString(),
            lastName: createMockString(),
            password: createMockString(),
            phoneNumber: createMockNumber(),
            startPosition: createMockPosition(),
            vehicle: createMockString(),
            registration: createMockString(),
            startTime: createMockString(),
            region: createMockRegion(),
            currentPackages: somePackageMock.id,
            undeliveredPackages: [],
            deliveredPackages: []
        });
        await insertObjectIntoDatabase('couriers', CourierSchema, someMockCurierToUpdate);

        await courierService.updatePackageStatus(someMockEmployeeNumber, somePackageMock.id, true);

        const result = await findOneInCollection('couriers', CourierSchema, 'employeeNumber', someMockEmployeeNumber);
        expect(result.deliveredPackages).toContain(somePackageMock.id);
        expect(result.currentPackages).toEqual(null);
    });
})
