import { createMockNumber, createMockPosition, createMockString } from "../mocks/utilities";
import { createMockCourierDtoPublic } from "./courier.dto.public.mock";

describe('CourierDtoPublicMock', () => {
    it('should create mock', () => {
        const mockEN = createMockString();
        const mockFirstName = createMockString();
        const mockLastName = createMockString();
        const mockPhoneNumber = createMockNumber();
        const mockStartPosition = createMockPosition();
        const mockVehicle = createMockString();
        const mockRegistration = createMockString();
        const mockStartTime = createMockString();

        const result = createMockCourierDtoPublic({
            employeeNumber: mockEN,
            firstName: mockFirstName,
            lastName: mockLastName,
            phoneNumber: mockPhoneNumber,
            startPosition: mockStartPosition,
            vehicle: mockVehicle,
            registration: mockRegistration,
            startTime: mockStartTime
        });

        expect(result).toEqual({
            employeeNumber: mockEN,
            firstName: mockFirstName,
            lastName: mockLastName,
            phoneNumber: mockPhoneNumber,
            startPosition: mockStartPosition,
            vehicle: mockVehicle,
            registration: mockRegistration,
            startTime: mockStartTime
        });
    });
});