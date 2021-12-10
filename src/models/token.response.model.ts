import { ApiProperty } from "@nestjs/swagger";

export interface ITokenResponse {
    userToken: string,
    mapToken: string
}

export class TokenResponse implements ITokenResponse {
    @ApiProperty()
    userToken: string;
    @ApiProperty()
    mapToken: string;

    constructor(props?: ITokenResponse) {
        if (props) {
            this.userToken = props.userToken;
            this.mapToken = props.mapToken;
        }
    }
}