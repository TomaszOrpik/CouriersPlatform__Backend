import { createMockDateString, createMockPosition, createMockString } from "../mocks/utilities";
import { IPackageValidateRequestModel, PackageValidateRequestModel } from "./packageValidate.request.model";

export const createMockPackageValidateRequestModel = (props?: IPackageValidateRequestModel): PackageValidateRequestModel => {
    return {
        id: createMockString(),
        packageNumber: createMockString(),
        sendDate: createMockDateString(),
        receiver: createMockString(),
        sender: createMockString(),
        position: createMockPosition(),
        comments: createMockString(),
        status: createMockString(),
        ...props
    }
}