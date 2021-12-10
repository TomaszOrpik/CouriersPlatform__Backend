import { createMockNumber, createMockString } from "../mocks/utilities";
import { Direction, IDirection } from "./direction.model";

export const createMockDirection = (props?: IDirection): Direction => {
    return {
        distance: createMockNumber(),
        duration: createMockNumber(),
        modifier: createMockString(),
        type: createMockString(),
        name: createMockString(),
        ...props
    }
}