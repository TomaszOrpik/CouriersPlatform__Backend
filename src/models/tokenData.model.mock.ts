import { createMockString } from "../mocks/utilities";
import { ITokenData, TokenData } from "./tokenData.model";

export const createMockTokenData = (props?: ITokenData): TokenData => {
    return {
        login: createMockString(),
        role: createMockString(),
        ...props
    }
}