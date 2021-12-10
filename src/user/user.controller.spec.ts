import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { createMockUserLoginDTO } from '../DTOs/userLogin.dto.mock';
import { UserDTO } from '../DTOs/user.dto';
import { createMockUserDTO } from '../DTOs/user.dto.mock';
import { User, UserSchema } from '../schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Admin, AdminSchema } from '../schemas/admin.schema';
import { SharedModule } from '../shared/shared.module';

describe('UserController', () => {
  let userController: UserController;
  let service: UserService;
  let someMockUserDto: UserDTO;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      imports: [SharedModule],
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: UserSchema
        },
        {
          provide: getModelToken(Admin.name),
          useValue: AdminSchema
        }
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
    service = app.get<UserService>(UserService);
    someMockUserDto = createMockUserDTO();
  });

  it('should be created', () => {
    expect(userController).toBeTruthy();
  });

  it('should get users', async () => {
    service.getUsers = jest.fn();
    await userController.getUsers();

    expect(service.getUsers).toBeCalled();
    expect(service.getUsers).toBeCalledTimes(1);
  });

  it('should add user', async () => {
    service.addUpdateUser = jest.fn();

    await userController.addUser(someMockUserDto);

    expect(service.addUpdateUser).toBeCalledWith(someMockUserDto);
    expect(service.addUpdateUser).toBeCalledTimes(1);
  });

  it('should validate user', async () => {
    service.validateUser = jest.fn();

    await userController.validateUser(someMockUserDto);

    expect(service.validateUser).toBeCalledWith(someMockUserDto);
    expect(service.validateUser).toHaveBeenCalledTimes(1);
  });

  it('should login user', async () => {
    const someMockLoginUserDTO = createMockUserLoginDTO();
    service.loginUser = jest.fn();

    await userController.loginUser(someMockLoginUserDTO);

    expect(service.loginUser).toBeCalledWith(someMockLoginUserDTO);
    expect(service.loginUser).toBeCalledTimes(1);
  });

  it('should login admin', async () => {
    const someMockLoginAdminDto = createMockUserLoginDTO();
    service.loginAdmin = jest.fn();

    await userController.loginAdmin(someMockLoginAdminDto);

    expect(service.loginAdmin).toBeCalledWith(someMockLoginAdminDto);
    expect(service.loginAdmin).toBeCalledTimes(1);
  })
});
