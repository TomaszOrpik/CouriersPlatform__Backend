import { Direction } from "./direction.model";
import { PositionWithDistance } from "./positionWithDistance.model";

export interface IGetDirectionsResponseModel {
    directions: Direction[],
    positionsWithDistance: PositionWithDistance[]
}

export class GetDirectionsResponseModel implements IGetDirectionsResponseModel {
    directions: Direction[];
    positionsWithDistance: PositionWithDistance[];
    constructor(props?: IGetDirectionsResponseModel) {
        if (props) {
            this.directions = props.directions;
            this.positionsWithDistance = props.positionsWithDistance;
        }
    }
}