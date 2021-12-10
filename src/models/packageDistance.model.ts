import { ApiProperty } from "@nestjs/swagger";

export interface IPackageDistance {
    packageId: string,
    distance: number,
    time: number
}

export class PackageDistance implements IPackageDistance {
    @ApiProperty()
    packageId: string;
    @ApiProperty()
    distance: number;
    @ApiProperty()
    time: number;

    constructor(props?: IPackageDistance) {
        if (props) {
            this.packageId = props.packageId;
            this.distance = props.distance;
            this.time = props.time;
        }
    }
}