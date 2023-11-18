import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddMedicalRecordDto {
  @IsNotEmpty()
  @IsString()
  patientId: string;

  @IsNotEmpty()
  @IsString()
  bloodGroup: string;

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsNotEmpty()
  @IsString()
  patientName: string;

  @IsNotEmpty()
  @IsString()
  height: string;

  @IsNotEmpty()
  @IsNumber()
  bmi: number;

  @IsNotEmpty()
  @IsBoolean()
  donorStatus: boolean;

  organList: Array<string>;

  createdAt: string;

  @IsNotEmpty()
  @IsString()
  createdBy: string;
}
