import { createMockString, createMockNumber } from "../mocks/utilities";
import { createMockUserDTOPublic } from "./user.dto.public.mock";

describe('userDtoPublicMock', () => {
    it('should create mock', () => {
        const id = createMockString();
        const phoneNumber = createMockNumber();
        const firstName = createMockString();
        const lastName = createMockString();
        const street = createMockString();
        const postCode = createMockString();
        const city = createMockString();

        const result = createMockUserDTOPublic({
            id,
            phoneNumber,
            firstName,
            lastName,
            street,
            postCode,
            city
        });

        expect(result).toEqual({
            id,
            phoneNumber,
            firstName,
            lastName,
            street,
            postCode,
            city
        })
    });
});