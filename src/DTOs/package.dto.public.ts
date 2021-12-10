import { ApiProperty } from "@nestjs/swagger";
import { PackageStatus } from "../models/packageStatus.enum";
import { Position } from "../models/position.model";
import { UserDtoPublic } from "./user.dto.public";

export interface IPackageDtoPublic {
    id: string;
    packageNumber: string;
    sendDate: Date;
    receiver: UserDtoPublic;
    sender: UserDtoPublic;
    position: Position;
    comments: string;
    status: PackageStatus;
}

export class PackageDtoPublic implements IPackageDtoPublic {
    @ApiProperty()
    id: string;
    @ApiProperty()
    packageNumber: string;
    @ApiProperty()
    sendDate: Date;
    @ApiProperty()
    receiver: UserDtoPublic;
    @ApiProperty()
    sender: UserDtoPublic;
    @ApiProperty()
    position: Position;
    @ApiProperty()
    comments: string;
    @ApiProperty()
    status: PackageStatus;

    constructor(props?: IPackageDtoPublic) {
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
