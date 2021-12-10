import { ApiProperty } from "@nestjs/swagger";
import { Direction } from "./direction.model";
import { PackageDistance } from "./packageDistance.model";

export interface ICourierPackagesResponseModel {
    packagesDistance: PackageDistance[],
    directions: Direction[]
}

export class CourierPackagesResponseModel implements ICourierPackagesResponseModel {
    @ApiProperty()
    packagesDistance: PackageDistance[];
    @ApiProperty()
    directions: Direction[];

    constructor(props?: ICourierPackagesResponseModel) {
        if (props) {
            this.packagesDistance = props.packagesDistance;
            this.directions = props.directions;
        }
    }
}