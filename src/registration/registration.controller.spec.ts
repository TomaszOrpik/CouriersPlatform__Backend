import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PackageModule } from '../package/package.module';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { RegistrationDto } from '../DTOs/registration.dto';
import { createMockRegistrationDto } from '../DTOs/registration.dto.mock';
import { createMockNumber, createMockString } from '../mocks/utilities';
import { createMockRegistrationForUser } from '../models/registrationForUser.request.model.mock';
import { Registration, RegistrationSchema } from '../schemas/registration.schema';
import { RegistrationsController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { rootMongooseTestModule } from '../mocks/mongoTestModule';
import { createMockAddRegistrationRequestModel } from '../models/addRegistration.request.model.mock';

describe('RegistrationController', () => {
  let registrationsController: RegistrationsController;
  let service: RegistrationService;
  let someMockRegistrationDto: RegistrationDto;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationsController],
      imports: [
        rootMongooseTestModule(),
        UserModule,
        PackageModule,
        SharedModule
      ],
      providers: [
        RegistrationService,
        {
          provide: getModelToken(Registration.name),
          useValue: RegistrationSchema
        }
      ],
    }).compile();

    registrationsController = app.get<RegistrationsController>(
      RegistrationsController,
    );
    service = app.get<RegistrationService>(RegistrationService);
    someMockRegistrationDto = createMockRegistrationDto();

  });

  it('should be created', () => {
    expect(registrationsController).toBeTruthy();
  });

  it('should get registrations', async () => {
    service.getRegistrations = jest.fn();

    await registrationsController.getRegistrations();

    expect(service.getRegistrations).toBeCalled();
    expect(service.getRegistrations).toBeCalledTimes(1);
  });

  it('should add registration', async () => {
    service.addUpdateRegistration = jest.fn();
    const someAddRegistrationRequestModel = createMockAddRegistrationRequestModel();
    const schema: Registration = {
      packageId: someAddRegistrationRequestModel.packageId,
      date: someAddRegistrationRequestModel.date,
      user: someAddRegistrationRequestModel.user,
      subject: someAddRegistrationRequestModel.subject,
      additionalInfo: someAddRegistrationRequestModel.additionaInfo,
      contactPhone: someAddRegistrationRequestModel.contactPhone,
      contactMail: someAddRegistrationRequestModel.contactMail,
      status: someAddRegistrationRequestModel.status
    }

    await registrationsController.addRegistration(someAddRegistrationRequestModel);

    expect(service.addUpdateRegistration).toBeCalledWith(schema);
    expect(service.addUpdateRegistration).toBeCalledTimes(1);
  });

  it('should validate registration', async () => {
    service.validateRegistration = jest.fn();
    const someRegistrationForUserRequestModel = createMockRegistrationForUser();

    await registrationsController.validateRegistration(someRegistrationForUserRequestModel);

    expect(service.validateRegistration).toBeCalledWith(someRegistrationForUserRequestModel);
    expect(service.validateRegistration).toBeCalledTimes(1);
  });

  it('should get registrations for user', async () => {
    const someParam = { id: createMockString() };
    service.getRegistrationsForUser = jest.fn();

    await registrationsController.getRegistrationsForUser(someParam);

    expect(service.getRegistrationsForUser).toBeCalledWith(someParam.id);
    expect(service.getRegistrationsForUser).toBeCalledTimes(1);
  });
});
