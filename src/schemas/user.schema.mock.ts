import { createMockNumber, createMockString } from "../mocks/utilities";
import { IUser, User } from "./user.schema";

export const createMockUser = (props?: IUser): User => {
    return {
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