import { PackageStatus } from "../models/packageStatus.enum";
import { IPackage } from "../schemas/package.schema";
import { EnumConverter } from "./enumConverter";
import { IPackageDto } from "./package.dto";
import { IPackageDtoPublic } from "./package.dto.public";
import { IUserDTO } from "./user.dto";
import { UserDtoAdapter } from "./user.dto.adapter";

export class PackageDtoAdapter {
    static toModel(dto: IPackageDto): IPackage {
        return {
            packageNumber: dto.packageNumber,
            sendDate: dto.sendDate.toString(),
            receiver: dto.receiver.id,
            sender: dto.sender.id,
            position: dto.position,
            comments: dto.comments,
            status: dto.status
        }
    }

    static toDto(id: string, model: IPackage, sender: IUserDTO, receiver: IUserDTO): IPackageDto {
        return {
            id,
            packageNumber: model.packageNumber,
            sendDate: new Date(model.sendDate),
            receiver,
            sender,
            position: model.position,
            comments: model.comments,
            status: PackageStatus[EnumConverter.getByValue(PackageStatus, model.status)]
        }
    }

    static toPublicDto(dto: IPackageDto): IPackageDtoPublic {
        const publicSender = UserDtoAdapter.toPublicDto(dto.sender);
        const publicReceiver = UserDtoAdapter.toPublicDto(dto.receiver);
        return {
            id: dto.id,
            packageNumber: dto.packageNumber,
            sendDate: dto.sendDate,
            receiver: publicReceiver,
            sender: publicSender,
            position: dto.position,
            comments: dto.comments,
            status: dto.status
        }
    }
}