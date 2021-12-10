import { ApiProperty } from "@nestjs/swagger";
import { Position } from "./position.model";

export interface IPackageRouteResponseModel {
    courierId: string;
    positions: Position[];
}

export class PackageRouteResponseModel implements IPackageRouteResponseModel {
    @ApiProperty()
    courierId: string;
    @ApiProperty()
    positions: Position[];

    constructor(props?: IPackageRouteResponseModel) {
        if (props) {
            this.courierId = props.courierId;
            this.positions = props.positions;
        }
    }
}