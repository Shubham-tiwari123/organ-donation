import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class OrganTransportDto {

  @IsString()
  shippingTime: string;

  @IsString()
  shippingDate: string;

  @IsString()
  patientId: string;

  @IsString()
  requestId: string;

  @IsString()
  vehicleNumber: string;

  createdAt: string;

  @IsString()
  createdBy: string
}
