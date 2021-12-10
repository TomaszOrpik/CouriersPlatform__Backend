import { createMockPosition, createMockString } from "../mocks/utilities";
import { IRegion, Region } from "./region.model";

export const createMockRegion = (props?: IRegion): Region => {
    return {
        name: createMockString(),
        leftTop: createMockPosition(),
        leftBottom: createMockPosition(),
        rightTop: createMockPosition(),
        rightBottom: createMockPosition(),
        ...props
    }
}