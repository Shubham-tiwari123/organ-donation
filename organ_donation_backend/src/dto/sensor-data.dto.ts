import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MappedType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class SensorDataDTO {

  @IsNotEmpty()
  @IsString()
  requestId: string;

  @IsNotEmpty()
  @IsString()
  vibration: string;

  @IsNotEmpty()
  @IsString()
  orientation: string;

  @IsNotEmpty()
  @IsString()
  temprature: string;

  @IsNotEmpty()
  @IsString()
  light_intensity: string;

  @IsNotEmpty()
  @IsString()
  humidity: string;

  @IsNotEmpty()
  @IsBoolean()
  open_close_detector: boolean;
  
}
