import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Position } from '../models/position.model';

export type PackageDocument = Package & Document;

export interface IPackage {
  packageNumber: string;
  sendDate: string;
  receiver: string;
  sender: string;
  position: Position;
  comments: string;
  status: string;
}

@Schema()
export class Package implements IPackage {
  @Prop({ type: String, required: true })
  packageNumber: string;
  @Prop({ type: String, required: true })
  sendDate: string;
  @Prop({ type: String, required: true })
  receiver: string;
  @Prop({ type: String, required: true })
  sender: string;
  @Prop({
    raw: ({
      latitude: Number,
      longitude: Number
    }), required: true
  })
  position: Position;
  @Prop({ type: String, required: false })
  comments: string;
  @Prop({ type: String, required: true })
  status: string;

  constructor(props?: IPackage) {
    if (props) {
      this.packageNumber = props.packageNumber;
      this.sendDate = props.sendDate;
      this.receiver = props.receiver;
      this.sender = props.sender;
      this.position = props.position;
      this.comments = props.comments;
      this.status = props.status;
    }
  }
}

export const PackageSchema = SchemaFactory.createForClass(Package);
