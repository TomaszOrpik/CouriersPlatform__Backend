import { createMockDateString, createMockPosition, createMockString } from "../mocks/utilities";
import { PackageStatus } from "../models/packageStatus.enum";
import { IPackageDto, PackageDto } from "./package.dto";
import { createMockUserDTO } from "./user.dto.mock";

export const createMockPackageDto = (props?: IPackageDto): PackageDto => {
    return {
        id: createMockString(),
        packageNumber: createMockString(),
        sendDate: new Date(createMockDateString()),
        receiver: createMockUserDTO(),
        sender: createMockUserDTO(),
        position: createMockPosition(),
        comments: createMockString(),
        status: PackageStatus.failed,
        ...props
    }
}