import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Doctor, DoctorSchema } from 'src/schemas/doctor.schema';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { Patient, PatientSchema } from 'src/schemas/patient.schema';
import { Hospital, HospitalSchema } from 'src/schemas/hospital.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Doctor.name,
      schema: DoctorSchema
    }, {
      name: Patient.name,
      schema: PatientSchema
    },{
      name: Hospital.name,
      schema: HospitalSchema
    }])
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService]
})
export class DoctorModule { }
