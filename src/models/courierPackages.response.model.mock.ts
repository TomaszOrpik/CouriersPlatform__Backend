import { CourierPackagesResponseModel, ICourierPackagesResponseModel } from "./courierPackages.response.model";
import { createMockDirection } from "./direction.model.mock";
import { createMockPackageDistance } from "./packageDistance.model.mock";

export const createMockCourierPackagesResponse = (props?: ICourierPackagesResponseModel): CourierPackagesResponseModel => {
    return {
        packagesDistance: [createMockPackageDistance()],
        directions: [createMockDirection()],
        ...props
    }
}