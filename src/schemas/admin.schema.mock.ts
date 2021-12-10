import { createMockString } from "../mocks/utilities";
import { Admin, IAdmin } from "./admin.schema";

export const createMockAdmin = (props?: IAdmin): Admin => {
    return {
        login: createMockString(),
        password: createMockString(),
        write: true,
        read: true,
        ...props
    }
}