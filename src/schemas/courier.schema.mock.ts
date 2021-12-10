import { createMockNumber, createMockPosition, createMockString } from "../mocks/utilities";
import { createMockRegion } from "../models/region.model.mock";
import { Courier, ICourier } from "./courier.schema";

export const createMockCourier = (props?: ICourier): Courier => {
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
        deliveredPackages: [createMockString()],
        undeliveredPackages: [createMockString()],
        currentPackages: createMockString(),
        ...props
    }
}