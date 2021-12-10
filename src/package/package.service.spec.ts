import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { UserModule } from "../user/user.module";
import { CourierModule } from "../courier/courier.module";
import { CourierService } from "../courier/courier.service";
import {
    connectToDatabase,
    dropCollection,
    insertObjectIntoDatabase,
    findOneInCollection,
    rootMongooseTestModule,
    closeInMongoConnection
} from "../mocks/mongoTestModule";
import { Package, PackageSchema } from "../schemas/package.schema";
import { User, UserSchema } from "../schemas/user.schema";
import { SharedModule } from "../shared/shared.module";
import { UserService } from "../user/user.service"
import { PackageService } from "./package.service";
import { PackageDto } from "../DTOs/package.dto";
import { createMockPackageDto } from "../DTOs/package.dto.mock";
import { PackageDtoAdapter } from "../DTOs/package.dto.adapter";
import { Position } from "../models/position.model";
import { createMockNumber, createMockPosition, createMockString } from "../mocks/utilities";
import { createMockUserDTO } from "../DTOs/user.dto.mock";
import { createMockPackageValidateRequestModel } from "../models/packageValidate.request.model.mock";
import { createMockCourierDto } from "../DTOs/courier.dto.mock";
import { createMockRegion } from "../models/region.model.mock";
import { createMockPackage } from "../schemas/package.schema.mock";

describe('PackageService', () => {
    let userService: UserService;
    let packageService: PackageService;
    let courierService: CourierService;
    let someMockPackageId: string;
    let someMockPackageDto: PackageDto;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([
                    { name: User.name, schema: UserSchema },
                    { name: Package.name, schema: PackageSchema }
                ]),
                SharedModule,
                UserModule,
                CourierModule
            ],
            providers: [PackageService]
        }).compile();

        userService = app.get<UserService>(UserService);
        courierService = app.get<CourierService>(CourierService);
        packageService = app.get<PackageService>(PackageService);
        await connectToDatabase();
    });

    beforeEach(async () => {
        someMockPackageDto = createMockPackageDto();
        someMockPackageId = await insertObjectIntoDatabase(
            'packages',
            PackageSchema,
            PackageDtoAdapter.toModel(someMockPackageDto)
        );
    });

    afterEach(async () => {
        await dropCollection('packages');
        await closeInMongoConnection();
    });

    it('should be defined', () => {
        expect(packageService).toBeDefined();
    });

    it('should add package', async () => {
        const somePackageToAdd = createMockPackage();

        await packageService.addUpdatePackage(somePackageToAdd);

        const result = await findOneInCollection('packages', PackageSchema, 'packageNumber', somePackageToAdd.packageNumber);

        expect(result.packageNumber).toEqual(somePackageToAdd.packageNumber);
        expect(result.sendDate).toEqual(somePackageToAdd.sendDate);
        expect(result.receiver).toEqual(somePackageToAdd.receiver);
        expect(result.sender).toEqual(somePackageToAdd.sender);
        expect(result.position).toEqual(somePackageToAdd.position);
        expect(result.comments).toEqual(somePackageToAdd.comments);
    });

    it('should update package', async () => {
        const someNewPosition = new Position({
            longitude: 50,
            latitude: 20
        });
        const someNewComments = createMockString();
        const someNewDate = new Date().toString();
        const someUpdatePackage = createMockPackage({
            packageNumber: someMockPackageDto.packageNumber,
            sendDate: someNewDate,
            receiver: someMockPackageDto.receiver.id,
            sender: someMockPackageDto.sender.id,
            position: someNewPosition,
            comments: someNewComments,
            status: someMockPackageDto.status
        });

        await packageService.addUpdatePackage(someUpdatePackage);

        const result = await findOneInCollection('packages', PackageSchema, '_id', someMockPackageId);
        expect(result.packageNumber).toEqual(someMockPackageDto.packageNumber);
        expect(result.sendDate).toEqual(someNewDate);
        expect(result.receiver).toEqual(someMockPackageDto.receiver.id);
        expect(result.sender).toEqual(someMockPackageDto.sender.id);
        expect(result.position).toEqual(someNewPosition);
        expect(result.comments).toEqual(someNewComments);
        expect(result.status).toEqual(someMockPackageDto.status);

    });

    it('should get packages', async () => {
        const someMockUser = createMockUserDTO();
        userService.getUser = jest.fn().mockResolvedValue(someMockUser);

        const result = await packageService.getPackages();

        expect(result).toEqual([{
            id: someMockPackageId,
            packageNumber: someMockPackageDto.packageNumber,
            sendDate: someMockPackageDto.sendDate,
            sender: someMockUser,
            receiver: someMockUser,
            position: someMockPackageDto.position,
            comments: someMockPackageDto.comments,
            status: someMockPackageDto.status
        }]);
    });

    it('should get package by id', async () => {
        const someMockUser = createMockUserDTO();
        userService.getUser = jest.fn().mockResolvedValue(someMockUser);

        const result = await packageService.getPackage(someMockPackageId);

        expect(result).toEqual({
            id: someMockPackageId,
            packageNumber: someMockPackageDto.packageNumber,
            sendDate: someMockPackageDto.sendDate,
            sender: someMockUser,
            receiver: someMockUser,
            position: someMockPackageDto.position,
            comments: someMockPackageDto.comments,
            status: someMockPackageDto.status
        });
    });

    it('should validate package', async () => {
        const someMockUser = createMockUserDTO();
        userService.getUser = jest.fn().mockResolvedValue(someMockUser);
        const someValidPosition = {
            latitude: 48.873748,
            longitude: 2.341049
        };
        const someMockCourier = createMockCourierDto({
            id: createMockString(),
            employeeNumber: createMockString(),
            firstName: createMockString(),
            lastName: createMockString(),
            password: createMockString(),
            phoneNumber: createMockNumber(),
            startPosition: createMockPosition(),
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
            deliveredPackages: [createMockPackageDto()],
            undeliveredPackages: [createMockPackageDto()],
            currentPackages: createMockPackageDto(),
        });
        courierService.getCouriers = jest.fn().mockResolvedValue([someMockCourier]);
        const someValidatePackageRequestModel = createMockPackageValidateRequestModel({
            id: createMockString(),
            packageNumber: createMockString(),
            sendDate: new Date('12/12/12').toString(),
            receiver: someMockUser.id,
            sender: someMockUser.id,
            position: someValidPosition,
            comments: createMockString(),
            status: createMockString()
        });

        const result = await packageService.validatePackage(someValidatePackageRequestModel);

        expect(result).toEqual([]);
    });

    it('should show error if package exist in database', async () => {
        const someMockUser = createMockUserDTO();
        userService.getUser = jest.fn().mockResolvedValue(someMockUser);
        const someValidPosition = {
            latitude: 48.873748,
            longitude: 2.341049
        };
        const someMockCourier = createMockCourierDto({
            id: createMockString(),
            employeeNumber: createMockString(),
            firstName: createMockString(),
            lastName: createMockString(),
            password: createMockString(),
            phoneNumber: createMockNumber(),
            startPosition: createMockPosition(),
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
            deliveredPackages: [createMockPackageDto()],
            undeliveredPackages: [createMockPackageDto()],
            currentPackages: createMockPackageDto(),
        });
        courierService.getCouriers = jest.fn().mockResolvedValue([someMockCourier]);
        const someValidatePackageRequestModel = createMockPackageValidateRequestModel({
            id: createMockString(),
            packageNumber: createMockString(),
            sendDate: new Date('12/12/30').toString(),
            receiver: someMockUser.id,
            sender: someMockUser.id,
            position: someValidPosition,
            comments: createMockString(),
            status: createMockString()
        });

        const result = await packageService.validatePackage(someValidatePackageRequestModel);

        expect(result).toContain('Data nadania nie może być późniejsza niż dzisiaj');
    });

    it('should get route for package', async () => {
        const someCourierEmployeeNumber = createMockString();
        const someMockCourier = createMockCourierDto({
            id: createMockString(),
            employeeNumber: someCourierEmployeeNumber,
            firstName: createMockString(),
            lastName: createMockString(),
            password: createMockString(),
            phoneNumber: createMockNumber(),
            startPosition: createMockPosition(),
            vehicle: createMockString(),
            registration: createMockString(),
            startTime: createMockString(),
            region: createMockRegion(),
            deliveredPackages: [createMockPackageDto()],
            undeliveredPackages: [createMockPackageDto()],
            currentPackages: someMockPackageDto,
        });
        courierService.getCouriers = jest.fn().mockResolvedValue([someMockCourier]);
        packageService.getPackage = jest.fn().mockResolvedValue(someMockPackageDto);

        const result = await packageService.getRouteForPackage(someMockPackageDto.id);

        expect(result.courierId).toEqual(someCourierEmployeeNumber);
        expect(result.positions).toContain(someMockPackageDto.position);
        expect(result.positions).toContain(someMockCourier.startPosition);
    });

    it('should get packages for sender', async () => {
        userService.getUser = jest.fn().mockResolvedValue(someMockPackageDto.sender);
        const someMockCourier = createMockCourierDto({
            id: createMockString(),
            employeeNumber: createMockString(),
            firstName: createMockString(),
            lastName: createMockString(),
            password: createMockString(),
            phoneNumber: createMockNumber(),
            startPosition: createMockPosition(),
            vehicle: createMockString(),
            registration: createMockString(),
            startTime: createMockString(),
            region: createMockRegion(),
            deliveredPackages: [createMockPackageDto()],
            undeliveredPackages: [createMockPackageDto()],
            currentPackages: someMockPackageDto,
        });
        courierService.getCouriers = jest.fn().mockResolvedValue([someMockCourier]);

        const result = await packageService.getPackagesForSender(someMockPackageDto.sender.id);

        expect(result[0].package.sender.id).toEqual(someMockPackageDto.sender.id);
    });

    it('should get packages for receiver', async () => {
        userService.getUser = jest.fn().mockResolvedValue(someMockPackageDto.receiver);
        const someMockCourier = createMockCourierDto({
            id: createMockString(),
            employeeNumber: createMockString(),
            firstName: createMockString(),
            lastName: createMockString(),
            password: createMockString(),
            phoneNumber: createMockNumber(),
            startPosition: createMockPosition(),
            vehicle: createMockString(),
            registration: createMockString(),
            startTime: createMockString(),
            region: createMockRegion(),
            deliveredPackages: [createMockPackageDto()],
            undeliveredPackages: [createMockPackageDto()],
            currentPackages: someMockPackageDto,
        });
        courierService.getCouriers = jest.fn().mockResolvedValue([someMockCourier]);

        const result = await packageService.getPackagesForSender(someMockPackageDto.receiver.id);

        expect(result[0].package.sender.id).toEqual(someMockPackageDto.receiver.id);
    });
})
