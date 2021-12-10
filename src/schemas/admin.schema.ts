import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type AdminDocument = Admin & Document;

export interface IAdmin {
    login: string;
    password: string;
    write: boolean;
    read: boolean;
}

@Schema()
export class Admin implements IAdmin {
    @Prop({ type: String, required: true })
    login: string;
    @Prop({ type: String, required: true })
    password: string;
    @Prop({ type: Boolean, required: true })
    write: boolean;
    @Prop({ type: Boolean, required: true })
    read: boolean;

    constructor(props?: IAdmin) {
        if (props) {
            this.login = props.login;
            this.password = props.password;
            this.read = props.read;
            this.write = props.write;
        }
    }
}

export const AdminSchema = SchemaFactory.createForClass(Admin);