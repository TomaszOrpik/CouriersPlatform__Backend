import { ICourier } from "../schemas/courier.schema";
import { ICourierDto } from "./courier.dto";
import { ICourierDtoPublic } from "./courier.dto.public";
import { IPackageDto } from "./package.dto";

export class CourierDtoAdapter {
    static toModel(dto: ICourierDto): ICourier {
        return {
            employeeNumber: dto.employeeNumber,
            firstName: dto.firstName,
            lastName: dto.lastName,
            password: dto.password,
            phoneNumber: dto.phoneNumber,
            startPosition: dto.startPosition,
            vehicle: dto.vehicle,
            registration: dto.registration,
            startTime: dto.startTime,
            region: dto.region,
            deliveredPackages: dto.deliveredPackages ? dto.deliveredPackages.map((p) => p.id) : [],
            undeliveredPackages: dto.undeliveredPackages ? dto.undeliveredPackages.map((p) => p.id) : [],
            currentPackages: dto.currentPackages ? dto.currentPackages.id : null
        }
    }

    static toDto(
        id: string,
        model: ICourier,
        deliveredPackages: IPackageDto[],
        undeliveredPackages: IPackageDto[],
        currentPackages: IPackageDto): ICourierDto {
        return {
            id,
            employeeNumber: model.employeeNumber,
            firstName: model.firstName,
            lastName: model.lastName,
            password: model.password,
            phoneNumber: model.phoneNumber,
            startPosition: model.startPosition,
            vehicle: model.vehicle,
            registration: model.registration,
            startTime: model.startTime,
            region: model.region,
            deliveredPackages,
            undeliveredPackages,
            currentPackages
        }
    }

    static toPublicDto(dto: ICourierDto): ICourierDtoPublic {
        return {
            employeeNumber: dto.employeeNumber,
            firstName: dto.firstName,
            lastName: dto.lastName,
            phoneNumber: dto.phoneNumber,
            startPosition: dto.startPosition,
            vehicle: dto.vehicle,
            registration: dto.registration,
            startTime: dto.startTime
        }
    }
}