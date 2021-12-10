import { IUser } from "../schemas/user.schema";
import { IUserDTO } from "./user.dto";
import { IUserDtoPublic } from "./user.dto.public";

export class UserDtoAdapter {
    static toModel(dto: IUserDTO): IUser {
        return {
            phoneNumber: dto.phoneNumber,
            password: dto.password,
            firstName: dto.firstName,
            lastName: dto.lastName,
            street: dto.street,
            postCode: dto.postCode,
            city: dto.city
        }
    }

    static toDto(id: string, model: IUser): IUserDTO {
        return {
            id,
            phoneNumber: model.phoneNumber,
            password: model.password,
            firstName: model.firstName,
            lastName: model.lastName,
            street: model.street,
            postCode: model.postCode,
            city: model.city
        }
    }

    static toPublicDto(dto: IUserDTO): IUserDtoPublic {
        return {
            id: dto.id,
            phoneNumber: dto.phoneNumber,
            firstName: dto.firstName,
            lastName: dto.lastName,
            street: dto.street,
            postCode: dto.postCode,
            city: dto.city
        }
    }
}