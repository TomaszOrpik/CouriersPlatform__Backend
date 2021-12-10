import { ApiProperty } from "@nestjs/swagger";

export interface IAdminResponse {
  read: boolean;
  write: boolean;
}

export class AdminResponse implements IAdminResponse {
  @ApiProperty()
  read: boolean;
  @ApiProperty()
  write: boolean;

  constructor(props?: IAdminResponse) {
    if (props) {
      this.read = props.read;
      this.write = props.write;
    }
  }
}
