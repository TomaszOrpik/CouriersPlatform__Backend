import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { rootMongooseTestModule } from '../mocks/mongoTestModule';
import { PackageModule } from '../package/package.module';
import { Courier, CourierSchema } from '../schemas/courier.schema';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { CourierController } from './courier.controller';
import { CourierService } from './courier.service';
import { createMockPosition, createMockString } from '../mocks/utilities';
import { createMockCourier } from '../schemas/courier.schema.mock';
import { createMockCourierLoginDto } from '../DTOs/courierLogin.dto.mock';
import { createMockUpdatePackageRequestModel } from '../models/updatePackage.request.model.mock';

describe('CourierController', () => {
  let courierController: CourierController;
  let courierService: CourierService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CourierController],
      imports: [
        rootMongooseTestModule(),
        PackageModule,
        UserModule,
        SharedModule,
      ],
      providers: [
        CourierService,
        {
          provide: getModelToken(Courier.name),
          useValue: CourierSchema
        },
      ],
    }).compile();

    courierController = app.get<CourierController>(CourierController);
    courierService = app.get<CourierService>(CourierService);
  });

  it('should be created', () => {
    expect(courierController).toBeTruthy();
  });

  it('should get couriers', async () => {
    courierService.getCouriers = jest.fn();
    await courierController.getCouriers();

    expect(courierService.getCouriers).toBeCalled();
    expect(courierService.getCouriers).toBeCalledTimes(1);
  });

  it('should setPackages', async () => {
    const mockParam = {
      id: createMockString()
    };
    courierService.setPackagesForCourier = jest.fn();

    await courierController.setPackagesForCourier(mockParam);

    expect(courierService.setPackagesForCourier).toBeCalledWith(mockParam.id);
    expect(courierService.setPackagesForCourier).toBeCalledTimes(1);
  });

  it('should update courier', async () => {
    const mockCourier = createMockCourier();
    courierService.addUpdateCourier = jest.fn();

    await courierController.addCourier(mockCourier);

    expect(courierService.addUpdateCourier).toBeCalledWith(mockCourier);
    expect(courierService.addUpdateCourier).toBeCalledTimes(1);
  });

  it('should validate courier', async () => {
    const mockCourier = createMockCourier();
    courierService.validateCourier = jest.fn();

    await courierController.validateCourier(mockCourier);

    expect(courierService.validateCourier).toBeCalledWith(mockCourier);
    expect(courierService.validateCourier).toBeCalledTimes(1);
  });

  it('should get courier route', async () => {
    const mockParam = {
      id: createMockString()
    };
    courierService.getCourierRoute = jest.fn();

    await courierController.getCourierRoute(mockParam);

    expect(courierService.getCourierRoute).toBeCalledWith(mockParam.id);
    expect(courierService.getCourierRoute).toBeCalledTimes(1);
  });

  it('should login courier', async () => {
    const someCourierLoginDto = createMockCourierLoginDto();
    courierService.loginCourier = jest.fn();

    await courierController.loginCourier(someCourierLoginDto);

    expect(courierService.loginCourier).toBeCalledWith(someCourierLoginDto);
    expect(courierService.loginCourier).toBeCalledTimes(1);
  });

  it('should update position', async () => {
    const mockParam = {
      id: createMockString()
    }
    const mockPosition = createMockPosition();
    const mockPositionRequest = {
      latitude: mockPosition.latitude.toString(),
      longitude: mockPosition.longitude.toString()
    }
    courierService.updateCourierPosition = jest.fn();

    await courierController.updatePosition(mockParam, mockPositionRequest);

    expect(courierService.updateCourierPosition)
      .toBeCalledWith(mockParam.id, mockPosition);
    expect(courierService.updateCourierPosition).toBeCalledTimes(1);
  });

  it('should get packages', async () => {
    const mockParam = {
      id: createMockString()
    };
    courierService.getPackagesForCourier = jest.fn();

    await courierController.getPackages(mockParam);

    expect(courierService.getPackagesForCourier).toBeCalledWith(mockParam.id);
    expect(courierService.getPackagesForCourier).toBeCalledTimes(1);
  });

  it('should clear packages', async () => {
    const mockParam = {
      id: createMockString()
    };
    courierService.clearPackagesForCourier = jest.fn();

    await courierController.clearPackages(mockParam);

    expect(courierService.clearPackagesForCourier)
      .toBeCalledWith(mockParam.id);
    expect(courierService.clearPackagesForCourier).toBeCalledTimes(1);
  });

  it('should update packages', async () => {
    const mockParam = {
      id: createMockString()
    };
    const mockRequest = createMockUpdatePackageRequestModel();
    courierService.updatePackageStatus = jest.fn();
    const isDeliveredBool = mockRequest.isDelivered === 'true';

    await courierController.updatePackage(mockParam, mockRequest);

    expect(courierService.updatePackageStatus)
      .toBeCalledWith(mockParam.id, mockRequest.packageId, isDeliveredBool);
    expect(courierService.updatePackageStatus).toBeCalledTimes(1);
  });
});
