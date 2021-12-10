import { createMockNumber, createMockPosition } from "../mocks/utilities";
import { createMockDirection } from "./direction.model.mock";
import { GetDirectionsResponseModel, IGetDirectionsResponseModel } from "./getDirectionsResponse.model";

export const createMockGetDirectionsResponseModel = (props?: IGetDirectionsResponseModel): GetDirectionsResponseModel => {
    return {
        directions: [createMockDirection()],
        positionsWithDistance: [{
            position: createMockPosition(),
            distance: createMockNumber(),
            time: createMockNumber()
        }],
        ...props
    }
}