import { ApiProperty } from "@nestjs/swagger";
import { PackageStatus } from "../models/packageStatus.enum";
import { Position } from "../models/position.model";
import { UserDTO } from "./user.dto";

export interface IPackageDto {
    id: string;
    packageNumber: string;
    sendDate: Date;
    receiver: UserDTO;
    sender: UserDTO;
    position: Position;
    comments: string;
    status: PackageStatus;
}

export class PackageDto implements IPackageDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    packageNumber: string;
    @ApiProperty()
    sendDate: Date;
    @ApiProperty()
    receiver: UserDTO;
    @ApiProperty()
    sender: UserDTO;
    @ApiProperty()
    position: Position;
    @ApiProperty()
    comments: string;
    @ApiProperty()
    status: PackageStatus;

    constructor(props?: IPackageDto) {
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
