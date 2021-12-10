import { createMockNumber, createMockString } from "../mocks/utilities";
import { IPackageDistance, PackageDistance } from "./packageDistance.model";

export const createMockPackageDistance = (props?: IPackageDistance): PackageDistance => {
    return {
        packageId: createMockString(),
        distance: createMockNumber(),
        time: createMockNumber(),
        ...props
    }
}