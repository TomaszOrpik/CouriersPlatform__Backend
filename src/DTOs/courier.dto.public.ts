import { ApiProperty } from "@nestjs/swagger";
import { Position } from "../models/position.model";

export interface ICourierDtoPublic {
    employeeNumber: string;
    firstName: string;
    lastName: string;
    phoneNumber: number;
    startPosition: Position;
    vehicle: string;
    registration: string;
    startTime: string;
}

export class CourierDtoPublic implements ICourierDtoPublic {
    @ApiProperty()
    employeeNumber: string;
    @ApiProperty()
    firstName: string;
    @ApiProperty()
    lastName: string;
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

    constructor(props?: ICourierDtoPublic) {
        if (props) {
            this.employeeNumber = props.employeeNumber;
            this.firstName = props.firstName;
            this.lastName = props.lastName;
            this.phoneNumber = props.phoneNumber;
            this.startPosition = props.startPosition;
            this.vehicle = props.vehicle;
            this.registration = props.registration;
            this.startTime = props.startTime;
        }
    }
}