import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type RegistrationDocument = Registration & Document;

export interface IRegistration {
  packageId: string;
  date: string;
  user: string;
  subject: string;
  additionalInfo: string;
  contactPhone: number;
  contactMail: string;
  status: string;
}

@Schema()
export class Registration implements IRegistration {
  @Prop({ type: String, required: true })
  packageId: string;
  @Prop({ type: String, required: true })
  date: string;
  @Prop({ type: String, required: true })
  user: string;
  @Prop({ type: String, required: true })
  subject: string;
  @Prop({ type: String, required: true })
  additionalInfo: string;
  @Prop({ type: Number, required: true })
  contactPhone: number;
  @Prop({ type: String, required: true })
  contactMail: string;
  @Prop({ type: String, required: true })
  status: string;

  constructor(props?: IRegistration) {
    if (props) {
      this.packageId = props.packageId;
      this.date = props.date;
      this.user = props.user;
      this.subject = props.subject;
      this.additionalInfo = props.additionalInfo;
      this.contactPhone = props.contactPhone;
      this.contactMail = props.contactMail;
      this.status = props.status;
    }
  }
}

export const RegistrationSchema = SchemaFactory.createForClass(Registration);
