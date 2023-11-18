import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PatientDocument = Document & Patient;

@Schema()
export class Patient {
  @Prop()
  userId: string;

  @Prop()
  userType: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop([])
  organ: Object[];

  @Prop()
  isDonor:boolean

  @Prop()
  isPatient:boolean

  @Prop({ type: Object })
  personalInfo: Object;

  @Prop({ type: Object })
  medicalInfo: Object;

  @Prop([String])
  donorsRejected: string[];

  @Prop(String)
  hospitalId: string;

  @Prop([
    {
      requestId: String,
      currentStatus: String,
      receiverId: String,
      patientName: String,
      priority: String,
      requestDetails: Object,
      requestStage: [
        {
          id: Number,
          currentStage: String,
          currentStatus: String,
        },
      ],
      takeDoctorAprroval: Boolean,
      takePatientAprroval: Boolean,
      organProcedureStatus: Object,
    },
  ])
  requestRaised: Object[];

  @Prop()
  notification: number;

  @Prop([])
  notificationList: Object[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
