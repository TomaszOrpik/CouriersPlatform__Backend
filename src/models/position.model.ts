import { ApiProperty } from "@nestjs/swagger";

export interface IPosition {
  latitude: number;
  longitude: number;
}

export class Position implements IPosition {
  @ApiProperty()
  latitude: number;
  @ApiProperty()
  longitude: number;

  constructor(props?: IPosition) {
    if (props) {
      this.latitude = props.latitude;
      this.longitude = props.longitude;
    }
  }

}
