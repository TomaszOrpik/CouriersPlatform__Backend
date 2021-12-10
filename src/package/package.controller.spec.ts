import { Test, TestingModule } from '@nestjs/testing';
import { createMockPackageValidateRequestModel } from '../models/packageValidate.request.model.mock';
import { PackageDto } from '../DTOs/package.dto';
import { createMockPackageDto } from '../DTOs/package.dto.mock';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';
import { createMockString } from '../mocks/utilities';
import { getModelToken } from '@nestjs/mongoose';
import { Package, PackageSchema } from '../schemas/package.schema';
import { CourierModule } from '../courier/courier.module';
import { UserModule } from '../user/user.module';
import { SharedModule } from '../shared/shared.module';
import { rootMongooseTestModule } from '../mocks/mongoTestModule';
import { createMockPackage } from '../schemas/package.schema.mock';

describe('PackageController', () => {
  let packageController: PackageController;
  let service: PackageService;
  let someMockPackageDto: PackageDto;
  let someMockPackageSchema: Package;
  let someParams: any;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PackageController],
      imports: [
        rootMongooseTestModule(),
        CourierModule,
        SharedModule,
        UserModule
      ],
      providers: [
        PackageService,
        {
          provide: getModelToken(Package.name),
          useValue: PackageSchema
        }
      ],
    }).compile();

    packageController = app.get<PackageController>(PackageController);
    service = app.get<PackageService>(PackageService);
    someMockPackageDto = createMockPackageDto();
    someMockPackageSchema = createMockPackage();
    someParams = { id: createMockString() };

  });

  it('should be created', () => {
    expect(packageController).toBeTruthy();
  });

  it('should get packages', async () => {
    service.getPackages = jest.fn();
    await packageController.getPackages();

    expect(service.getPackages).toBeCalled();
    expect(service.getPackages).toBeCalledTimes(1);
  });

  it('should add package', async () => {
    service.addUpdatePackage = jest.fn();

    await packageController.addPackage(someMockPackageSchema);

    expect(service.addUpdatePackage).toBeCalledWith(someMockPackageSchema);
    expect(service.addUpdatePackage).toBeCalledTimes(1);
  });

  it('should validate package', async () => {
    const somePackageValidateRequestModel = createMockPackageValidateRequestModel();
    service.validatePackage = jest.fn();

    await packageController.validatePackage(somePackageValidateRequestModel);

    expect(service.validatePackage).toBeCalledWith(somePackageValidateRequestModel);
    expect(service.validatePackage).toBeCalledTimes(1);
  });

  it('should get route for package', async () => {
    service.getRouteForPackage = jest.fn();

    await packageController.getPackageRoute(someParams);

    expect(service.getRouteForPackage).toBeCalledWith(someParams.id);
    expect(service.getRouteForPackage).toBeCalledTimes(1);
  });

  it('should get packages for sender', async () => {
    service.getPackagesForSender = jest.fn();

    await packageController.getPackagesForSender(someParams);

    expect(service.getPackagesForSender).toBeCalledWith(someParams.id);
    expect(service.getPackagesForSender).toBeCalledTimes(1);
  });

  it('should get packages for receiver', async () => {
    service.getPackagesForReceiver = jest.fn();

    await packageController.getPackagesForReceiver(someParams);

    expect(service.getPackagesForReceiver).toBeCalledWith(someParams.id);
    expect(service.getPackagesForReceiver).toBeCalledTimes(1);
  });
});
