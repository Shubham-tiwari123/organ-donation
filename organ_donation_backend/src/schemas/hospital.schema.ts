import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HospitalDocument =  Document & Hospital;

@Schema()
export class Hospital {
    
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
  hospitalAddress: string;

  @Prop()
  createdBy: string;

  @Prop()
  createdAt: Date;

}

export const HospitalSchema = SchemaFactory.createForClass(Hospital);