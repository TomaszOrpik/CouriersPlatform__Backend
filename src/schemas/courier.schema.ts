import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Position } from "../models/position.model";
import { Region } from "../models/region.model";

export type CourierDocument = Courier & Document;

export interface ICourier {
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
    deliveredPackages: string[];
    undeliveredPackages: string[];
    currentPackages: string;
}

@Schema()
export class Courier implements ICourier {
    @ApiProperty()
    @Prop({ type: String, required: true })
    employeeNumber: string;
    @ApiProperty()
    @Prop({ type: String, required: true })
    firstName: string;
    @ApiProperty()
    @Prop({ type: String, required: true })
    lastName: string;
    @ApiProperty()
    @Prop({ type: String, required: true })
    password: string;
    @ApiProperty()
    @Prop({ type: Number, required: true })
    phoneNumber: number;
    @ApiProperty()
    @Prop({
        raw: {
            latitude: Number,
            longitude: Number
        }, required: true
    })
    startPosition: Position;
    @ApiProperty()
    @Prop({ type: String, required: true })
    vehicle: string;
    @ApiProperty()
    @Prop({ type: String, required: true })
    registration: string;
    @ApiProperty()
    @Prop({ type: String, required: true })
    startTime: string;
    @ApiProperty()
    @Prop({
        raw: ({
            name: String,
            leftTop: {
                latitude: Number,
                longitude: Number
            },
            leftBottom: {
                latitude: Number,
                longitude: Number
            },
            rightTop: {
                latitude: Number,
                longitude: Number
            },
            rightBottom: {
                latitude: Number,
                longitude: Number
            },
        })
    })
    region: Region;
    @ApiProperty({ required: false })
    @Prop([String])
    deliveredPackages: string[];
    @ApiProperty({ required: false })
    @Prop([String])
    undeliveredPackages: string[];
    @ApiProperty({ required: false })
    @Prop({ type: String })
    currentPackages: string;

    constructor(props?: ICourier) {
        if (props) {
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

export const CourierSchema = SchemaFactory.createForClass(Courier);