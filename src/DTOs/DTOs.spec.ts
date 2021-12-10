import exp from "constants";
import { PackageStatus } from "../models/packageStatus.enum";
import { createMockRegion } from "../models/region.model.mock";
import { RegistrationStatus } from "../models/registrationStatus.enum";
import { createMockNumber, createMockPosition, createMockString } from "../mocks/utilities";
import { CourierDto } from "./courier.dto";
import { CourierDtoPublic } from "./courier.dto.public";
import { CourierLoginDto } from "./courierLogin.dto";
import { PackageDto } from "./package.dto";
import { createMockPackageDto } from "./package.dto.mock";
import { PackageDtoPublic } from "./package.dto.public";
import { RegistrationDto } from "./registration.dto";
import { UserDTO } from "./user.dto";
import { createMockUserDTO } from "./user.dto.mock";
import { UserDtoPublic } from "./user.dto.public";
import { UserLoginDTO } from "./userLogin.dto";

describe('DTOs constructors', () => {

    it('should create courierDtoPublic dto', () => {
        const employeeNumber = createMockString();
        const firstName = createMockString();
        const lastName = createMockString();
        const phoneNumber = createMockNumber();
        const startPosition = createMockPosition();
        const vehicle = createMockString();
        const registration = createMockString();
        const startTime = createMockString();

        const result = new CourierDtoPublic({
            employeeNumber,
            firstName,
            lastName,
            phoneNumber,
            startPosition,
            vehicle,
            registration,
            startTime
        });

        expect(result).toEqual({
            employeeNumber,
            firstName,
            lastName,
            phoneNumber,
            startPosition,
            vehicle,
            registration,
            startTime
        });
    });

    it('should create CourierDto dto', () => {
        const id = createMockString();
        const employeeNumber = createMockString();
        const firstName = createMockString();
        const lastName = createMockString();
        const password = createMockString();
        const phoneNumber = createMockNumber();
        const startPosition = createMockPosition();
        const vehicle = createMockString();
        const registration = createMockString();
        const startTime = createMockString();
        const region = createMockRegion();
        const deliveredPackages = [createMockPackageDto()];
        const undeliveredPackages = [createMockPackageDto()];
        const currentPackages = createMockPackageDto();

        const result = new CourierDto({
            id,
            employeeNumber,
            firstName,
            lastName,
            password,
            phoneNumber,
            startPosition,
            vehicle,
            registration,
            startTime,
            region,
            deliveredPackages,
            undeliveredPackages,
            currentPackages
        });

        expect(result).toEqual({
            id,
            employeeNumber,
            firstName,
            lastName,
            password,
            phoneNumber,
            startPosition,
            vehicle,
            registration,
            startTime,
            region,
            deliveredPackages,
            undeliveredPackages,
            currentPackages
        });
    });

    it('should create courierLogin dto', () => {
        const login = createMockString();
        const password = createMockString();

        const result = new CourierLoginDto({
            login,
            password
        });

        expect(result).toEqual({
            login,
            password
        });
    });

    it('should create packageDtoPublic dto', () => {
        const id = createMockString();
        const packageNumber = createMockString();
        const sendDate = new Date();
        const receiver = createMockUserDTO();
        const sender = createMockUserDTO();
        const position = createMockPosition();
        const comments = createMockString();
        const status = PackageStatus.waiting;

        const result = new PackageDtoPublic({
            id,
            packageNumber,
            sendDate,
            receiver,
            sender,
            position,
            comments,
            status
        });

        expect(result).toEqual({
            id,
            packageNumber,
            sendDate,
            receiver,
            sender,
            position,
            comments,
            status
        });
    });

    it('should create packageDto dto', () => {
        const id = createMockString();
        const packageNumber = createMockString();
        const sendDate = new Date();
        const receiver = createMockUserDTO();
        const sender = createMockUserDTO();
        const position = createMockPosition();
        const comments = createMockString();
        const status = PackageStatus.waiting;

        const result = new PackageDto({
            id,
            packageNumber,
            sendDate,
            receiver,
            sender,
            position,
            comments,
            status
        });

        expect(result).toEqual({
            id,
            packageNumber,
            sendDate,
            receiver,
            sender,
            position,
            comments,
            status
        });
    });

    it('should create registrationDto dto', () => {
        const id = createMockString();
        const packageDto = createMockPackageDto();
        const date = new Date();
        const user = createMockUserDTO();
        const subject = createMockString();
        const additionalInfo = createMockString();
        const contactPhone = createMockNumber();
        const contactMail = createMockString();
        const status = RegistrationStatus.waiting;

        const result = new RegistrationDto({
            id,
            package: packageDto,
            date,
            user,
            subject,
            additionalInfo,
            contactPhone,
            contactMail,
            status
        });

        expect(result).toEqual({
            id,
            package: packageDto,
            date,
            user,
            subject,
            additionalInfo,
            contactPhone,
            contactMail,
            status
        });
    });

    it('should create UserDto dto', () => {
        const id = createMockString();
        const phoneNumber = createMockNumber();
        const firstName = createMockString();
        const lastName = createMockString();
        const street = createMockString();
        const postCode = createMockString();
        const city = createMockString();

        const result = new UserDtoPublic({
            id,
            phoneNumber,
            firstName,
            lastName,
            street,
            postCode,
            city
        });

        expect(result).toEqual({
            id,
            phoneNumber,
            firstName,
            lastName,
            street,
            postCode,
            city
        });
    });

    it('should create userDto dto', () => {
        const id = createMockString();
        const phoneNumber = createMockNumber();
        const password = createMockString();
        const firstName = createMockString();
        const lastName = createMockString();
        const street = createMockString();
        const postCode = createMockString();
        const city = createMockString();

        const result = new UserDTO({
            id,
            phoneNumber,
            password,
            firstName,
            lastName,
            street,
            postCode,
            city
        });

        expect(result).toEqual({
            id,
            phoneNumber,
            password,
            firstName,
            lastName,
            street,
            postCode,
            city
        });
    });

    it('should create userLoginDto dto', () => {
        const login = createMockString();
        const password = createMockString();

        const result = new UserLoginDTO({
            login,
            password
        });

        expect(result).toEqual({
            login,
            password
        });
    });
});