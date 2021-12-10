import { ApiProperty } from "@nestjs/swagger";

export interface IDirection {
    distance: number,
    duration: number,
    modifier: string,
    type: string,
    name: string
}

export class Direction implements IDirection {
    @ApiProperty()
    distance: number;
    @ApiProperty()
    duration: number;
    @ApiProperty()
    modifier: string;
    @ApiProperty()
    type: string;
    @ApiProperty()
    name: string;

    constructor(props?: IDirection) {
        if (props) {
            this.distance = props.distance;
            this.duration = props.duration;
            this.modifier = props.modifier;
            this.type = props.type;
            this.name = props.name;
        }
    }

}