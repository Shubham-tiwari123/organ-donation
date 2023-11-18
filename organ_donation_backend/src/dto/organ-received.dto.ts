import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class OrganReceivedDto {

  @IsString()
  receivingTime: string;

  @IsString()
  receivingDate: string;

  @IsString()
  doctorId: string;

  @IsString()
  patientId: string;

  @IsString()
  requestId: string;

  @IsString()
  doctorName: string;

  createdAt: string;

  @IsString()
  createdBy: string
}
