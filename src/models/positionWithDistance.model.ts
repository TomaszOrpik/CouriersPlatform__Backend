import { Position } from "./position.model";

export interface PositionWithDistance {
    position: Position,
    distance: number,
    time: number,
}