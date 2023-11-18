import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ApprovalRequestDto {

  @IsString()
  patientId: string;

  @IsString()
  requestId: string;

  @IsString()
  doctorId: string;

  createdAt: string;

  @IsString()
  createdBy: string
}
