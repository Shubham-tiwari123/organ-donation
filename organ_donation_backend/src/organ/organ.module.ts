import { Module } from '@nestjs/common';
import { OrganController } from './organ.controller';
import { OrganService } from './organ.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from '../schemas/patient.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Patient.name, schema: PatientSchema }
  ])],
  controllers: [OrganController],
  providers: [OrganService]
})
export class OrganModule {}
