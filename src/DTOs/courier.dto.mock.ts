import { createMockNumber, createMockPosition, createMockString } from "../mocks/utilities";
import { createMockRegion } from "../models/region.model.mock";
import { CourierDto, ICourierDto } from "./courier.dto";
import { createMockPackageDto } from "./package.dto.mock";

export const createMockCourierDto = (props?: ICourierDto): CourierDto => {
    return {
        employeeNumber: createMockString(),
        firstName: createMockString(),
        lastName: createMockString(),
        password: createMockString(),
        phoneNumber: createMockNumber(),
        startPosition: createMockPosition(),
        vehicle: createMockString(),
        registration: createMockString(),
        startTime: createMockString(),
        region: createMockRegion(),
        deliveredPackages: [createMockPackageDto()],
        undeliveredPackages: [createMockPackageDto()],
        currentPackages: createMockPackageDto(),
        ...props
    }
}