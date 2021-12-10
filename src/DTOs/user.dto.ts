import { ApiProperty } from "@nestjs/swagger";
import { IUser } from "../schemas/user.schema";

export interface IUserDTO extends IUser {
    id: string;
}

export class UserDTO implements IUserDTO {
    @ApiProperty()
    id: string;
    @ApiProperty()
    phoneNumber: number;
    @ApiProperty()
    password: string;
    @ApiProperty()
    firstName: string;
    @ApiProperty()
    lastName: string;
    @ApiProperty()
    street: string;
    @ApiProperty()
    postCode: string;
    @ApiProperty()
    city: string;

    constructor(props?: IUserDTO) {
        if (props) {
            this.id = props.id;
            this.phoneNumber = props.phoneNumber;
            this.password = props.password;
            this.firstName = props.firstName;
            this.lastName = props.lastName;
            this.street = props.street;
            this.postCode = props.postCode;
            this.city = props.city;
        }
    }
}