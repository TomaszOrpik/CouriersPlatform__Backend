import { createMockString } from "../mocks/utilities";
import { ICourierLoginDto, CourierLoginDto } from "./courierLogin.dto";

export const createMockCourierLoginDto = (props?: ICourierLoginDto): CourierLoginDto => {
    return {
        login: createMockString(),
        password: createMockString(),
        ...props
    }
}