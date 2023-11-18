import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class OrganRemovedDto {

  @IsString()
  operationTime: string;

  @IsString()
  operationDate: string;

  @IsString()
  patientId: string;

  @IsString()
  requestId: string;

  @IsString()
  bloodGroup: string;

  @IsString()
  organRequest: string;

  @IsString()
  doctorName: string;

  @IsString()
  doctorId: string;

  @IsString()
  donorId: string;

  createdAt: string;

  @IsString()
  createdBy: string
}
