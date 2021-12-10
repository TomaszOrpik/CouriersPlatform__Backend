import { RegistrationStatus } from "../models/registrationStatus.enum";
import { IRegistration, Registration } from "../schemas/registration.schema";
import { EnumConverter } from "./enumConverter";
import { IPackageDto } from "./package.dto";
import { IRegistrationDto, RegistrationDto } from "./registration.dto";
import { IUserDTO } from "./user.dto";

export class RegistrationDtoAdapter {

    static toDto(
        id: string,
        model: IRegistration,
        packageDto: IPackageDto,
        userDto: IUserDTO
    ): RegistrationDto {
        return {
            id,
            package: packageDto,
            date: new Date(model.date),
            user: userDto,
            subject: model.subject,
            additionalInfo: model.additionalInfo,
            contactPhone: model.contactPhone,
            contactMail: model.contactMail,
            status: RegistrationStatus[EnumConverter.getByValue(RegistrationStatus, model.status)]
        }
    }

    static toModel(dto: IRegistrationDto): Registration {
        return {
            packageId: dto.package.id,
            date: dto.date.toString(),
            user: dto.user.id,
            subject: dto.subject,
            additionalInfo: dto.additionalInfo,
            contactPhone: dto.contactPhone,
            contactMail: dto.contactMail,
            status: dto.status
        }
    }
}