import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientSchema, Patient } from 'src/schemas/patient.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Patient.name,
      schema: PatientSchema
    }])
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService]
})
export class PatientModule { }
