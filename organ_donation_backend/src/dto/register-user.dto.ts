import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterUserDto {

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  userType: string;

  @IsNotEmpty()
  @IsString()
  account: string;
}
