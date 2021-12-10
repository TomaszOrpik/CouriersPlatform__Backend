import { createMockString } from "../mocks/utilities";
import { IUserLoginDTO, UserLoginDTO } from "./userLogin.dto";

export const createMockUserLoginDTO = (props?: IUserLoginDTO): UserLoginDTO => {
    return {
        login: createMockString(),
        password: createMockString(),
        ...props
    }
}