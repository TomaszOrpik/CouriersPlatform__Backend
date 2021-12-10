import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { PackageModule } from "../package/package.module";
import {
    closeInMongoConnection,
    connectToDatabase,
    dropCollection,
    findOneInCollection,
    insertObjectIntoDatabase,
    rootMongooseTestModule
} from "../mocks/mongoTestModule";
import { PackageService } from "../package/package.service";
import { Registration, RegistrationSchema } from "../schemas/registration.schema";
import { createMockRegistration } from "../schemas/registration.schema.mock";
import { UserService } from "../user/user.service";
import { RegistrationService } from "./registration.service"
import { UserModule } from "../user/user.module";
import { SharedModule } from "../shared/shared.module";
import { createMockUserDTO } from "../DTOs/user.dto.mock";
import { createMockPackageDto } from "../DTOs/package.dto.mock";
import { RegistrationStatus } from "../models/registrationStatus.enum";
import { createMockRegistrationForUser } from "../models/registrationForUser.request.model.mock";
import { createMockString } from "../mocks/utilities";
import { EnumConverter } from "../DTOs/enumConverter";

describe('RegistrationService', () => {
    let service: RegistrationService;
    let packageService: PackageService;
    let userService: UserService;
    let someMockRegistrationId: string;
    let someMockRegistration: Registration;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([{
                    name: Registration.name, schema: RegistrationSchema
                }]),
                PackageModule,
                UserModule,
                SharedModule
            ],
            providers: [
                RegistrationService,
            ]
        }).compile();

        service = app.get<RegistrationService>(RegistrationService);
        packageService = app.get<PackageService>(PackageService);
        userService = app.get<UserService>(UserService);

        await connectToDatabase();
    });

    beforeEach(async () => {
        someMockRegistration = createMockRegistration();
        someMockRegistrationId = await insertObjectIntoDatabase(
            'registrations',
            RegistrationSchema,
            someMockRegistration
        );
    });

    afterEach(async () => {
        await dropCollection('registrations');
        await closeInMongoConnection();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should add registration', async () => {
        const mockRegistrationToAdd = createMockRegistration();

        await service.addUpdateRegistration(mockRegistrationToAdd);

        const result = await findOneInCollection(
            'registrations',
            RegistrationSchema,
            'subject',
            mockRegistrationToAdd.subject
        );

        expect(result.date).toEqual(mockRegistrationToAdd.date.toString());
        expect(result.user).toEqual(mockRegistrationToAdd.user);
        expect(result.subject).toEqual(mockRegistrationToAdd.subject);
        expect(result.additionalInfo).toEqual(mockRegistrationToAdd.additionalInfo);
        expect(result.contactPhone).toEqual(mockRegistrationToAdd.contactPhone);
        expect(result.contactMail).toEqual(mockRegistrationToAdd.contactMail);
        expect(result.status).toEqual(mockRegistrationToAdd.status);
    });

    it('should update registration', async () => {
        const someNewSubject = createMockString();
        const someNewAdditionalInfo = createMockString();
        const someMockUserDto = createMockUserDTO();
        const someUpdateRegistration = createMockRegistration({
            packageId: someMockRegistration.packageId,
            date: someMockRegistration.date,
            user: someMockUserDto.id,
            subject: someNewSubject,
            additionalInfo: someNewAdditionalInfo,
            contactPhone: someMockRegistration.contactPhone,
            contactMail: someMockRegistration.contactMail,
            status: someMockRegistration.status
        });

        await service.addUpdateRegistration(someUpdateRegistration, someMockRegistrationId);

        const result = await findOneInCollection(
            'registrations',
            RegistrationSchema,
            '_id',
            someMockRegistrationId
        );

        expect(result.packageId).toEqual(someMockRegistration.packageId);
        expect(result.contactMail).toEqual(someMockRegistration.contactMail);
        expect(result.contactPhone).toEqual(someMockRegistration.contactPhone);
        expect(result.additionalInfo).toEqual(someNewAdditionalInfo);
        expect(result.subject).toEqual(someNewSubject);
        expect(result.user).toEqual(someMockUserDto.id);
    });

    it('should get registrations', async () => {
        const somePackage = createMockPackageDto();
        const someUser = createMockUserDTO();
        userService.getUser = jest.fn().mockReturnValue(someUser);
        packageService.getPackage = jest.fn().mockReturnValue(somePackage);

        const result = await service.getRegistrations();

        expect(result).toEqual([{
            id: someMockRegistrationId,
            package: somePackage,
            date: new Date(someMockRegistration.date),
            user: someUser,
            subject: someMockRegistration.subject,
            additionalInfo: someMockRegistration.additionalInfo,
            contactPhone: someMockRegistration.contactPhone,
            contactMail: someMockRegistration.contactMail,
            status: RegistrationStatus[EnumConverter.getByValue(RegistrationStatus, someMockRegistration.status)]
        }])
    });

    it('should validate registration', async () => {
        const somePackage = createMockPackageDto();
        const someUser = createMockUserDTO();
        userService.getUser = jest.fn().mockReturnValue(someUser);
        packageService.getPackage = jest.fn().mockReturnValue(somePackage);
        const someRegistrationToValidate = createMockRegistrationForUser();

        const result = await service.validateRegistration(someRegistrationToValidate);
        expect(result).toEqual([]);
    });

    it('should show error if registration exist in database', async () => {
        const someUser = createMockUserDTO();
        const somePackage = createMockPackageDto();
        let registrationRequestModel = createMockRegistrationForUser();
        registrationRequestModel.id = someMockRegistrationId;
        userService.getUser = jest.fn().mockReturnValue(someUser);
        packageService.getPackage = jest.fn().mockReturnValue(somePackage);

        const result = await service.validateRegistration(registrationRequestModel);

        expect(result).toContain('Ten numer zgłoszenia już jest w systemie');
    });

    it('should get registrations for user', async () => {
        const someUser = createMockUserDTO();
        const somePackage = createMockPackageDto();
        userService.getUser = jest.fn().mockReturnValue(someUser);
        packageService.getPackage = jest.fn().mockReturnValue(somePackage);

        const result = await service.getRegistrationsForUser(someUser.id);

        expect(result[0].packageId).toEqual(somePackage.id);
        expect(result[0].date).toEqual(someMockRegistration.date);
        expect(result[0].user).toEqual(someUser.id);
        expect(result[0].subject).toEqual(someMockRegistration.subject);
        expect(result[0].additionalInfo).toEqual(someMockRegistration.additionalInfo);
        expect(result[0].contactPhone).toEqual(someMockRegistration.contactPhone);
        expect(result[0].contactMail).toEqual(someMockRegistration.contactMail);
    });
})
