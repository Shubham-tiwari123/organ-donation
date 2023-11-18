import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterHospitalDto {

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  userType: string;

  @IsNotEmpty()
  @IsString()
  hospitalAddress: string;

  @IsNotEmpty()
  @IsString()
  hospitalMetamaskAddress: string;

  @IsNotEmpty()
  @IsString()
  hospitalName: string;

  @IsNotEmpty()
  @IsString()
  createdBy: string;

}
