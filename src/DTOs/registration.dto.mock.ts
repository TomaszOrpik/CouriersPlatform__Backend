import { createMockDateString, createMockNumber, createMockString } from "../mocks/utilities";
import { RegistrationStatus } from "../models/registrationStatus.enum";
import { createMockPackageDto } from "./package.dto.mock";
import { IRegistrationDto, RegistrationDto } from "./registration.dto";
import { createMockUserDTO } from "./user.dto.mock";

export const createMockRegistrationDto = (props?: IRegistrationDto): RegistrationDto => {
    return {
        id: createMockString(),
        package: createMockPackageDto(),
        date: new Date(createMockDateString()),
        user: createMockUserDTO(),
        subject: createMockString(),
        additionalInfo: createMockString(),
        contactPhone: createMockNumber(),
        contactMail: createMockString(),
        status: RegistrationStatus.waiting,
        ...props
    }
}