import { ApiProperty } from "@nestjs/swagger";

export interface IUpdatePackageRequestModel {
    packageId: string;
    isDelivered: string;
}

export class UpdatePackageRequestModel implements IUpdatePackageRequestModel {
    @ApiProperty()
    packageId: string;
    @ApiProperty()
    isDelivered: string;

    constructor(props?: IUpdatePackageRequestModel) {
        if (props) {
            this.packageId = props.packageId;
            this.isDelivered = props.isDelivered;
        }
    }
}