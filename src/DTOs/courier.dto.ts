import { ApiProperty } from "@nestjs/swagger";
import { Position } from "../models/position.model";
import { Region } from "../models/region.model";
import { PackageDto } from "./package.dto";

export interface ICourierDto {
    id: string;
    employeeNumber: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber: number;
    startPosition: Position;
    vehicle: string;
    registration: string;
    startTime: string;
    region: Region;
    deliveredPackages: PackageDto[];
    undeliveredPackages: PackageDto[];
    currentPackages: PackageDto;
}

export class CourierDto implements ICourierDto {
    @ApiProperty()
    id: string;
    @ApiProperty()
    employeeNumber: string;
    @ApiProperty()
    firstName: string;
    @ApiProperty()
    lastName: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    phoneNumber: number;
    @ApiProperty()
    startPosition: Position;
    @ApiProperty()
    vehicle: string;
    @ApiProperty()
    registration: string;
    @ApiProperty()
    startTime: string;
    @ApiProperty()
    region: Region;
    @ApiProperty()
    deliveredPackages: PackageDto[];
    @ApiProperty()
    undeliveredPackages: PackageDto[];
    @ApiProperty()
    currentPackages: PackageDto;

    constructor(props?: ICourierDto) {
        if (props) {
            this.id = props.id;
            this.employeeNumber = props.employeeNumber;
            this.firstName = props.firstName;
            this.lastName = props.lastName;
            this.password = props.password;
            this.phoneNumber = props.phoneNumber;
            this.startPosition = props.startPosition;
            this.vehicle = props.vehicle;
            this.registration = props.registration;
            this.startTime = props.startTime;
            this.region = props.region;
            this.deliveredPackages = props.deliveredPackages;
            this.undeliveredPackages = props.undeliveredPackages;
            this.currentPackages = props.currentPackages;
        }
    }

}