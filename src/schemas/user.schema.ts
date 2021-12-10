import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = User & Document;

export interface IUser {
    phoneNumber: number;
    password: string;
    firstName: string;
    lastName: string;
    street: string;
    postCode: string;
    city: string;
}

@Schema()
export class User implements IUser {
    @Prop({ type: Number, required: true })
    phoneNumber: number;
    @Prop({ type: String, required: true })
    password: string;
    @Prop({ type: String, required: true })
    firstName: string;
    @Prop({ type: String, required: true })
    lastName: string;
    @Prop({ type: String, required: true })
    street: string;
    @Prop({ type: String, required: true })
    postCode: string;
    @Prop({ type: String, required: true })
    city: string;

    constructor(props?: IUser) {
        if (props) {
            this.phoneNumber = props.phoneNumber;
            this.password = props.password;
            this.firstName = props.firstName;
            this.lastName = props.lastName;
            this.street = props.street;
            this.postCode = props.postCode;
            this.city = props.city;
        }
    }
}

export const UserSchema = SchemaFactory.createForClass(User);