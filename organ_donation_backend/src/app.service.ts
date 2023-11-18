import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiResponse } from './dto/response.dto';
import { ApiResponseStatus } from './enum/api-response.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { Doctor, DoctorDocument } from './schemas/doctor.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Hospital, HospitalDocument } from './schemas/hospital.schema';
import { RegisterHospitalDto } from './dto/register-hospital.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Hospital.name) private hospitalModel: Model<HospitalDocument>,
    private readonly jwtService: JwtService,
  ) {}

  private async generateToken(userId: string): Promise<string> {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }

  async registerNewUser(
    registerUserDto: RegisterUserDto,
  ): Promise<ApiResponse<any>> {
    if (registerUserDto.userType.toLowerCase() == 'doctor') {
      const res = await this.doctorModel
        .findOne({ userId: registerUserDto.account })
        .exec();
      if (res == null) {
        let data = {
          userId: registerUserDto.account,
          userType: registerUserDto.userType,
          email: registerUserDto.email,
          password: registerUserDto.password,
          createdAt: new Date().toISOString()
        };
        await new this.doctorModel(data).save();
        return new ApiResponse(ApiResponseStatus.Success, {
          message: 'User registered ',
          jwt: await this.generateToken(registerUserDto.account),
        });
      } else {
        return new ApiResponse(ApiResponseStatus.Error, {
          message: 'User already registered',
        });
      }
    } else if (registerUserDto.userType.toLowerCase() == 'patient') {
      const res = await this.patientModel
        .findOne({ userId: registerUserDto.account })
        .exec();
      if (res == null) {
        let data = {
          userId: registerUserDto.account,
          userType: registerUserDto.userType,
          email: registerUserDto.email,
          password: registerUserDto.password,
          createdAt: new Date().toISOString()
        };
        await new this.patientModel(data).save();
        return new ApiResponse(ApiResponseStatus.Success, {
          message: 'User registered ',
          jwt: await this.generateToken(registerUserDto.account),
        });
      } else {
        return new ApiResponse(ApiResponseStatus.Error, {
          message: 'User already registered',
        });
      }
    } else {
      return new ApiResponse(ApiResponseStatus.Error, {
        message: 'Invalid user type',
      });
    }
  }

  async checkAddress(address: string): Promise<ApiResponse<any>> {
    const checkDoctor = await this.doctorModel
      .findOne({ userId: address })
      .exec();

    const checkPatient = await this.patientModel
      .findOne({ userId: address })
      .exec();

    const checkHospital = await this.hospitalModel
      .findOne({ userId: address })
      .exec();

    if(checkDoctor == null && checkPatient == null && checkHospital == null){
      return new ApiResponse(ApiResponseStatus.Error, { message: "User Not found. Register user" })
    }else{
      let userType = null;
      let hospitalName = null;
      if(checkDoctor!= null){
        userType = JSON.parse(JSON.stringify(checkDoctor)).userType
      }else if(checkPatient!=null){
        userType = JSON.parse(JSON.stringify(checkPatient)).userType
      }else{
        userType = JSON.parse(JSON.stringify(checkHospital)).userType
        hospitalName = JSON.parse(JSON.stringify(checkHospital)).hospitalName
      }
      return new ApiResponse(ApiResponseStatus.Success, { 
        message: "User already registered", 
        jwt: await this.generateToken(address),
        userType,
        hospitalName: hospitalName 
      })
    }
  }

  async registerHospital(registerHospital: RegisterHospitalDto): Promise<ApiResponse<any>>{
    const res = await this.hospitalModel
        .findOne({ userId: registerHospital.hospitalMetamaskAddress.toLowerCase() })
        .exec();
      if (res == null) {
        let data = {
          userId: registerHospital.hospitalMetamaskAddress.toLowerCase(),
          userType: registerHospital.userType,
          email: registerHospital.email,
          password: registerHospital.email,
          hospitalName: registerHospital.hospitalName,
          hospitalAddress: registerHospital.hospitalAddress,
          createdBy: registerHospital.createdBy,
          createdAt: new Date().toISOString()
        };
        await new this.hospitalModel(data).save();
        return new ApiResponse(ApiResponseStatus.Success, {
          message: 'User registered ',
          jwt: await this.generateToken(registerHospital.hospitalMetamaskAddress),
        });
      } else {
        return new ApiResponse(ApiResponseStatus.Error, {
          message: 'User already registered',
        });
      }
  }
}
