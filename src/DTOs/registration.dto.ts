import { RegistrationStatus } from "../models/registrationStatus.enum";
import { ApiProperty } from "@nestjs/swagger";
import { PackageDto } from "./package.dto";
import { UserDTO } from "./user.dto";

export interface IRegistrationDto {
    id: string;
    package: PackageDto;
    date: Date;
    user: UserDTO;
    subject: string;
    additionalInfo: string;
    contactPhone: number;
    contactMail: string;
    status: RegistrationStatus;
}

export class RegistrationDto implements IRegistrationDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    package: PackageDto;
    @ApiProperty()
    date: Date;
    @ApiProperty()
    user: UserDTO;
    @ApiProperty()
    subject: string;
    @ApiProperty()
    additionalInfo: string;
    @ApiProperty()
    contactPhone: number;
    @ApiProperty()
    contactMail: string;
    @ApiProperty()
    status: any;

    constructor(props?: IRegistrationDto) {
        if (props) {
            this.id = props.id;
            this.package = props.package;
            this.date = props.date;
            this.user = props.user;
            this.subject = props.subject;
            this.additionalInfo = props.additionalInfo;
            this.contactPhone = props.contactPhone;
            this.contactMail = props.contactMail;
            this.status = props.status;
        }
    }

}