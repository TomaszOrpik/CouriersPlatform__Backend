import { ApiProperty } from "@nestjs/swagger";
import { RegistrationStatus } from "./registrationStatus.enum";

export interface IRegistrationForUserRequestModel {
    id: string;
    packageId: string;
    date: string;
    user: string;
    subject: string;
    additionalInfo: string;
    contactPhone: number;
    contactMail: string;
    status: RegistrationStatus;
}

export class RegistrationForUserRequestModel implements IRegistrationForUserRequestModel {
    @ApiProperty()
    id: string;
    @ApiProperty()
    packageId: string;
    @ApiProperty()
    date: string;
    @ApiProperty()
    user: string;
    @ApiProperty()
    subject: string;
    @ApiProperty()
    additionalInfo: string;
    @ApiProperty()
    contactPhone: number;
    @ApiProperty()
    contactMail: string;
    @ApiProperty()
    status: RegistrationStatus;

    constructor(props?: IRegistrationForUserRequestModel) {
        if (props) {
            this.id = props.id;
            this.packageId = props.packageId;
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