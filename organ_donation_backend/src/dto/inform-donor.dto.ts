import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class InformDonorDto {

  @IsString()
  patientId: string;

  @IsString()
  requestId: string;

  @IsString()
  doctorId: string;

  @IsString()
  donorId: string;

  createdAt: string;

  @IsString()
  createdBy: string
}
