import { ApiProperty } from "@nestjs/swagger";
import { CourierDtoPublic } from "../DTOs/courier.dto.public";
import { PackageDtoPublic } from "../DTOs/package.dto.public";

export interface IPackageForUserResponse {
    package: PackageDtoPublic;
    courier?: CourierDtoPublic;
    deliveryTime?: string;
}

export class PackageForUserResponse {
    @ApiProperty()
    package: PackageDtoPublic;
    @ApiProperty()
    courier?: CourierDtoPublic;
    @ApiProperty()
    deliveryTime?: string;

    constructor(props: IPackageForUserResponse) {
        this.package = props.package;
        if (props.courier) this.courier = props.courier;
        if (props.deliveryTime) this.deliveryTime = props.deliveryTime;
    }
}