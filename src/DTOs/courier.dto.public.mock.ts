import { createMockNumber, createMockPosition, createMockString } from "../mocks/utilities";
import { CourierDtoPublic, ICourierDtoPublic } from "./courier.dto.public";

export const createMockCourierDtoPublic = (props?: ICourierDtoPublic): CourierDtoPublic => {
    return {
        employeeNumber: createMockString(),
        firstName: createMockString(),
        lastName: createMockString(),
        phoneNumber: createMockNumber(),
        startPosition: createMockPosition(),
        vehicle: createMockString(),
        registration: createMockString(),
        startTime: createMockString(),
        ...props
    }
}