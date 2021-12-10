import { createMockDateString, createMockPosition, createMockString } from "../mocks/utilities";
import { PackageStatus } from "../models/packageStatus.enum";
import { IPackageDtoPublic, PackageDtoPublic } from "./package.dto.public";
import { createMockUserDTOPublic } from "./user.dto.public.mock";

export const createMockPackageDtoPublic = (props?: IPackageDtoPublic): PackageDtoPublic => {
    return {
        id: createMockString(),
        packageNumber: createMockString(),
        sendDate: new Date(createMockDateString()),
        receiver: createMockUserDTOPublic(),
        sender: createMockUserDTOPublic(),
        position: createMockPosition(),
        comments: createMockString(),
        status: PackageStatus.failed,
        ...props
    }
}