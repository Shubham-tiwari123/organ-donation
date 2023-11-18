import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiResponse } from './dto/response.dto';
import { ApiResponseStatus } from './enum/api-response.enum';
import { RegisterHospitalDto } from './dto/register-hospital.dto';
import {
  ApiOperation,
  ApiTags,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';

@ApiTags('Admin and Auth APIs')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/register')
  @ApiOperation({
    summary: 'Register API',
    description: 'This API helps user to register on platform',
  })
  async registerNewUser(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<ApiResponse<any>> {
    try {
      return await this.appService.registerNewUser(registerUserDto);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error creating patient.',
      );
    }
  }

  @Get('/login')
  @ApiOperation({
    summary: 'Login API',
    description: 'This API helps user to login into platform',
  })
  async checkAddress(
    @Query('address') address: string,
  ): Promise<ApiResponse<any>> {
    try {
      return await this.appService.checkAddress(address);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error creating patient.',
      );
    }
  }

  @Post('/admin/register/hospital')
  @ApiOperation({
    summary: 'Admin Control API',
    description: 'This API enables Admin to add hospitals to platform',
  })
  async registerHospital(
    @Body() registerHospital: RegisterHospitalDto,
  ): Promise<ApiResponse<any>> {
    try {
      return await this.appService.registerHospital(registerHospital);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error creating patient.',
      );
    }
  }
}
