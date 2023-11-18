import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class OrganMatchRequestDto {
  @IsString()
  patientId: string;

  @IsString()
  requestId: string;

  @IsString()
  bloodGroup: string;

  @IsString()
  organRequest: string;

  @IsString()
  createdBy: string;

  @IsString()
  donorId: string;
}
