import { Module } from '@nestjs/common';
import { HospitalController } from './hospital.controller';
import { HospitalService } from './hospital.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from 'src/schemas/patient.schema';
import { Doctor, DoctorSchema } from 'src/schemas/doctor.schema';
import { IotService } from 'src/iot/iot.service';
import { IOT, IOTSchema } from 'src/schemas/iot.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Patient.name, schema: PatientSchema },
    { name: Doctor.name, schema: DoctorSchema },
    { name: IOT.name, schema: IOTSchema }
  ])],
  controllers: [HospitalController],
  providers: [HospitalService, IotService]
})
export class HospitalModule {}
