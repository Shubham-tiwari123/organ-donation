import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class OrganTransplantDto {

  @IsString()
  operationTime: string;

  @IsString()
  operationDate: string;

  @IsString()
  requestId: string;

  @IsString()
  patientId: string;

  @IsString()
  doctorName: string;

  @IsString()
  doctorId: string;

  @IsString()
  operationStatus: string;

  createdAt: string;

  @IsString()
  createdBy: string
}
