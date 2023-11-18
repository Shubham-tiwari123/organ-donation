import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdatePatientConsentDto {

  @IsString()
  patientId: string;

  @IsString()
  requestId: string;

  @IsString()
  donorId: string;

  @IsBoolean()
  approvalStatus: boolean;

  @IsString()
  organRequest: string;

  createdAt: string;

  @IsString()
  createdBy: string
}
