import { createMockDateString, createMockPackageStatus, createMockPosition, createMockString } from "../mocks/utilities"
import { IPackage, Package } from "./package.schema"

export const createMockPackage = (props?: IPackage): Package => {
    return {
        packageNumber: createMockString(),
        sendDate: createMockDateString(),
        receiver: createMockString(),
        sender: createMockString(),
        position: createMockPosition(),
        comments: createMockString(),
        status: createMockPackageStatus(),
        ...props
    }
}