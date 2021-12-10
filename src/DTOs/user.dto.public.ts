import { ApiProperty } from "@nestjs/swagger";

export interface IUserDtoPublic {
    id: string;
    phoneNumber: number;
    firstName: string;
    lastName: string;
    street: string;
    postCode: string;
    city: string;
}

export class UserDtoPublic implements IUserDtoPublic {
    @ApiProperty()
    id: string;
    @ApiProperty()
    phoneNumber: number;
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

    constructor(props?: IUserDtoPublic) {
        if (props) {
            this.id = props.id;
            this.phoneNumber = props.phoneNumber;
            this.firstName = props.firstName;
            this.lastName = props.lastName;
            this.street = props.street;
            this.postCode = props.postCode;
            this.city = props.city;
        }
    }
}
