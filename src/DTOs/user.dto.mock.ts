import { createMockNumber, createMockString } from "../mocks/utilities";
import { IUserDTO, UserDTO } from "./user.dto";

export const createMockUserDTO = (props?: IUserDTO): UserDTO => {
    return {
        id: createMockString(),
        phoneNumber: createMockNumber(),
        password: createMockString(),
        firstName: createMockString(),
        lastName: createMockString(),
        street: createMockString(),
        postCode: createMockString(),
        city: createMockString(),
        ...props
    }
}