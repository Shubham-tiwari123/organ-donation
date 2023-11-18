import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IOTDocument =  Document & IOT;

@Schema()
export class IOT {
    
  @Prop()
  requestId: number;

  @Prop()
  initialized: boolean;

}

export const IOTSchema = SchemaFactory.createForClass(IOT);