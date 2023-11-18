import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DoctorDocument =  Document & Doctor;

@Schema()
export class Doctor {
    
  @Prop()
  userId: string;

  @Prop()
  userType: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  hospitalName: string;

  @Prop()
  hospitalId: string;

  @Prop({type: Object})
  personalInfo: Object;

  @Prop([String])
  donorsRejected: string[];

  @Prop()
  notification: number;

}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);