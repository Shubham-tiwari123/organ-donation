import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './infra/mongoose/database.module';
import { OrganModule } from './organ/organ.module';
import { HospitalModule } from './hospital/hospital.module';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from './schemas/patient.schema';
import { Doctor, DoctorSchema } from './schemas/doctor.schema';
import { JwtModule } from '@nestjs/jwt';
import { IotModule } from './iot/iot.module';
import { Hospital, HospitalSchema } from './schemas/hospital.schema';
import { IOT, IOTSchema } from './schemas/iot.schema';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    DatabaseModule,
    HospitalModule,
    OrganModule,
    PatientModule,
    DoctorModule,
    IotModule,
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Hospital.name, schema: HospitalSchema },
      { name: IOT.name, schema: IOTSchema },
    ]),
    JwtModule.register({
      secret: 'shubham-secret',
      signOptions: { expiresIn: '24h' }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
