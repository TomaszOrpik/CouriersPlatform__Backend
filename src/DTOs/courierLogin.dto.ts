import { ApiProperty } from "@nestjs/swagger";

export interface ICourierLoginDto {
    login: string;
    password: string;
}

export class CourierLoginDto implements ICourierLoginDto {
    @ApiProperty()
    login: string;
    @ApiProperty()
    password: string;

    constructor(props?: ICourierLoginDto) {
        if (props) {
            this.login = props.login;
            this.password = props.password;
        }
    }
}