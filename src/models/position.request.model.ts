import { ApiProperty } from "@nestjs/swagger"

export interface IPositionRequest {
    latitude: string,
    longitude: string,
}

export class PositionRequest implements IPositionRequest {
    @ApiProperty()
    latitude: string;
    @ApiProperty()
    longitude: string;

    constructor(props: IPositionRequest) {
        this.latitude = props?.latitude;
        this.longitude = props?.longitude;
    }

}