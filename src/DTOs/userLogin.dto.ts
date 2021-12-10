import { ApiProperty } from "@nestjs/swagger";

export interface IUserLoginDTO {
    login: string;
    password: string;
}

export class UserLoginDTO implements IUserLoginDTO {
    @ApiProperty()
    login: string;
    @ApiProperty()
    password: string;

    constructor(props?: IUserLoginDTO) {
        if (props) {
            this.login = props.login;
            this.password = props.password;
        }
    }
}