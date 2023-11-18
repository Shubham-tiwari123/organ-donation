import { IsBoolean, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateOrganRequest {
  @IsString()
  patientId: string;

  @IsString()
  requestId: string;

  @IsString()
  patientName: string;

  @IsString()
  doctorId: string;

  @IsString()
  doctorName: string;

  @IsString()
  bloodGroup: string;

  @IsNumber()
  bmi: number;

  @IsString()
  priority: string;

  @IsString()
  organRequired: string;

  createdAt: string;

  @IsString()
  createdBy: string;
}
