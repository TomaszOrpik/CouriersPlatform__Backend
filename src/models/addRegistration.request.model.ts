export interface IAddRegistrationRequestModel {
    id: string;
    packageId: string;
    date: string;
    user: string;
    subject: string;
    additionaInfo: string;
    contactPhone: number;
    contactMail: string;
    status: string;
}

export class AddRegistrationRequestModel implements IAddRegistrationRequestModel {
    id: string;
    packageId: string;
    date: string;
    user: string;
    subject: string;
    additionaInfo: string;
    contactPhone: number;
    contactMail: string;
    status: string;
    constructor(props?: IAddRegistrationRequestModel) {
        this.id = props?.id;
        this.packageId = props?.packageId;
        this.date = props?.date;
        this.user = props?.user;
        this.subject = props?.subject;
        this.additionaInfo = props?.additionaInfo;
        this.contactPhone = props?.contactPhone;
        this.contactMail = props?.contactMail;
        this.status = props?.status;
    }

}