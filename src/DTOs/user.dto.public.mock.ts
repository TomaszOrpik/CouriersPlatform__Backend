import { createMockNumber, createMockString } from "../mocks/utilities"
import { IUserDtoPublic, UserDtoPublic } from "./user.dto.public"

export const createMockUserDTOPublic = (props?: IUserDtoPublic): UserDtoPublic => {
    return {
        id: createMockString(),
        phoneNumber: createMockNumber(),
        firstName: createMockString(),
        lastName: createMockString(),
        street: createMockString(),
        postCode: createMockString(),
        city: createMockString(),
        ...props
    }
}