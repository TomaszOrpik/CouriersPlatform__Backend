import { createMockString } from "../mocks/utilities"
import { IUpdatePackageRequestModel, UpdatePackageRequestModel } from "./updatePackage.request.model"

export const createMockUpdatePackageRequestModel = (props?: IUpdatePackageRequestModel): UpdatePackageRequestModel => {
    return {
        packageId: createMockString(),
        isDelivered: 'true',
        ...props
    }
}