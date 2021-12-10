import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { createMockUser } from "../schemas/user.schema.mock";
import { User, UserSchema } from "../schemas/user.schema";
import { UserService } from "./user.service";
import { createMockString } from "../mocks/utilities";
import { closeInMongoConnection, connectToDatabase, dropCollection, findOneInCollection, insertObjectIntoDatabase, rootMongooseTestModule } from "../mocks/mongoTestModule";
import { createMockUserDTO } from "../DTOs/user.dto.mock";
import { createMockUserLoginDTO } from "../DTOs/userLogin.dto.mock";
import { SharedModule } from "../shared/shared.module";
import { Admin, AdminSchema } from "../schemas/admin.schema";
import { AuthService } from "../shared/auth.service";
import { createMockAdmin } from "../schemas/admin.schema.mock";


describe('UserService', () => {
    let userService: UserService;
    let authService: AuthService;
    let someMockUserId: string;
    let someMockUser: User;
    let someMockAdmin: Admin;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                rootMongooseTestModule(),
                MongooseModule.forFeature([
                    { name: User.name, schema: UserSchema },
                    { name: Admin.name, schema: AdminSchema }
                ]),
                SharedModule],
            providers: [UserService],
        }).compile();

        userService = app.get<UserService>(UserService);
        authService = app.get<AuthService>(AuthService);
        await connectToDatabase();
    });

    beforeEach(async () => {
        someMockUser = createMockUser();
        someMockAdmin = createMockAdmin();
        someMockUserId = await insertObjectIntoDatabase('users', UserSchema, someMockUser);
        await insertObjectIntoDatabase('admins', AdminSchema, someMockAdmin);
    });

    afterEach(async () => {
        await dropCollection('users');
        await dropCollection('admins');
        await closeInMongoConnection();
    });


    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    it('should add user', async () => {
        const mockUserDtoToAdd = createMockUserDTO();

        await userService.addUpdateUser(mockUserDtoToAdd);

        const result = await findOneInCollection('users', UserSchema, 'firstName', mockUserDtoToAdd.firstName);
        expect(result.firstName).toEqual(mockUserDtoToAdd.firstName);
        expect(result.lastName).toEqual(mockUserDtoToAdd.lastName);
        expect(result.password).toEqual(mockUserDtoToAdd.password);
        expect(result.phoneNumber).toEqual(mockUserDtoToAdd.phoneNumber);
        expect(result.street).toEqual(mockUserDtoToAdd.street);
        expect(result.postCode).toEqual(mockUserDtoToAdd.postCode);
        expect(result.city).toEqual(mockUserDtoToAdd.city);
    });

    it('should update user', async () => {
        const someNewFirstName = createMockString();
        const someNewLastName = createMockString();
        const someUpdatedUser = createMockUserDTO({
            id: someMockUserId,
            firstName: someNewFirstName,
            lastName: someNewLastName,
            password: someMockUser.password,
            city: someMockUser.city,
            phoneNumber: 2,
            postCode: someMockUser.postCode,
            street: someMockUser.street
        });

        await userService.addUpdateUser(someUpdatedUser);

        const result = await findOneInCollection('users', UserSchema, '_id', someMockUserId);
        expect(result.firstName).toEqual(someNewFirstName);
        expect(result.lastName).toEqual(someNewLastName);
        expect(result.password).toEqual(someMockUser.password);
        expect(result.phoneNumber).toEqual(2);
        expect(result.city).toEqual(someMockUser.city);
        expect(result.postCode).toEqual(someMockUser.postCode);
        expect(result.street).toEqual(someMockUser.street);
    });

    it('should get users', async () => {

        const result = await userService.getUsers();

        expect(result).toEqual([{
            id: someMockUserId,
            password: someMockUser.password,
            firstName: someMockUser.firstName,
            lastName: someMockUser.lastName,
            phoneNumber: someMockUser.phoneNumber,
            street: someMockUser.street,
            postCode: someMockUser.postCode,
            city: someMockUser.city
        }]);
    });

    it('should validate user', async () => {
        const someUserToValidate = createMockUserDTO();

        const result = await userService.validateUser(someUserToValidate);

        expect(result).toEqual([]);
    });

    it('should show error if user exist in database', async () => {
        const someExistingUserDto = {
            id: someMockUserId,
            ...someMockUser
        }
        const result = await userService.validateUser(someExistingUserDto);

        expect(result).toContain('Ten numer telefonu już jest w systemie');
    });

    it('should login user', async () => {
        const someUserToLogin = createMockUserLoginDTO({
            login: someMockUserId,
            password: someMockUser.password
        });
        const someTokenString = createMockString();
        authService.generateJwt = jest.fn().mockReturnValue(someTokenString);

        const result = await userService.loginUser(someUserToLogin);

        expect(result.tokens.userToken).toEqual(someTokenString);
        expect(result.tokens.mapToken).toEqual(someTokenString);
    });

    it('should login admin', async () => {
        const someAdminToLogin = createMockUserLoginDTO({
            login: someMockAdmin.login,
            password: someMockAdmin.password
        });
        const someTokenString = createMockString();
        authService.generateJwt = jest.fn().mockReturnValue(someTokenString);

        const result = await userService.loginAdmin(someAdminToLogin);

        expect(result.token.userToken).toEqual(someTokenString);
        expect(result.token.mapToken).toEqual(someTokenString);
    })
});