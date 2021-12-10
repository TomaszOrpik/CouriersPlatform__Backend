import { ApiProperty } from "@nestjs/swagger";
import { IPackage } from "../schemas/package.schema";
import { Position } from "./position.model";

export interface IPackageValidateRequestModel extends IPackage {
    id: string;
}

export class PackageValidateRequestModel implements IPackage {
    @ApiProperty()
    id: string;
    @ApiProperty()
    packageNumber: string;
    @ApiProperty()
    sendDate: string;
    @ApiProperty()
    receiver: string;
    @ApiProperty()
    sender: string;
    @ApiProperty()
    position: Position;
    @ApiProperty()
    comments: string;
    @ApiProperty()
    status: string;

    constructor(props?: IPackageValidateRequestModel) {
        if (props) {
            this.id = props.id;
            this.packageNumber = props.packageNumber;
            this.sendDate = props.sendDate;
            this.receiver = props.receiver;
            this.sender = props.sender;
            this.position = props.position;
            this.comments = props.comments;
            this.status = props.status;
        }
    }

}