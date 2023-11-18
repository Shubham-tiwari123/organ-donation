import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { ApiResponse } from 'src/dto/response.dto';
import { ApiResponseStatus } from 'src/enum/api-response.enum';
import { DoctorApprovalDto } from 'src/dto/doctor-approval.dto';
import { CreateDoctorDto } from 'src/dto/create-doctor-dto';
import {
  ApiOperation,
  ApiTags,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';

@ApiTags('Doctor APIs')
@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}
  @ApiOperation({
    summary: 'Store Doctors Personal Details',
    description: 'This API helps to register doctors personal details',
  })
  @Post('save/personal-detail')
  async saveDoctorPersonalInfo(
    @Body() createDoctorDto: CreateDoctorDto,
  ): Promise<ApiResponse<any>> {
    try {
      return await this.doctorService.saveDoctorPersonalInfo(createDoctorDto);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error creating patient.',
      );
    }
  }
  @ApiOperation({
    summary: 'Retrieve Doctors Personal Details',
    description: 'This API helps to get doctors personal details',
  })
  @Get('personal-detail')
  async getDoctorPersonalInfo(
    @Query('id') id: string,
  ): Promise<ApiResponse<any>> {
    try {
      return await this.doctorService.getDoctorPersonalInfo(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return new ApiResponse(
          ApiResponseStatus.Error,
          undefined,
          'Patient not found.',
        );
      }
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching patient.',
      );
    }
  }

  // Get Donor list under particular hospital where doctor is working:
  @Get('donor-list')
  @ApiOperation({
    summary: 'List all Donors',
    description:
      'This API returns list of Donors associated with Doctor`s Hospital',
  })
  async getDonorList(
    @Query('hospitalId') hospitalId: string,
  ): Promise<ApiResponse<any>> {
    try {
      return this.doctorService.getDonorList(hospitalId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return new ApiResponse(
          ApiResponseStatus.Error,
          undefined,
          'Patient not found.',
        );
      }
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching patient.',
      );
    }
  }

  @Get('donor-details')
  @ApiOperation({
    summary: 'Retreive Donor Details',
    description: 'This API helps to get all details of donor',
  })
  async getDonorDetails(
    @Query('patientId') patientId: string,
    @Query('organType') organType: string,
  ): Promise<ApiResponse<any>> {
    try {
      return this.doctorService.getDonorDetails(
        patientId,
        organType.toLowerCase(),
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        return new ApiResponse(
          ApiResponseStatus.Error,
          undefined,
          'Patient not found.',
        );
      }
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching patient.',
      );
    }
  }

  //fetch list of patient treated by doctor
  @Get('organ-receiver-list')
  @ApiOperation({
    summary: 'List of receivers associated with Doctor',
    description:
      'This API helps to get list of all receiver doctor is treating',
  })
  async getOrganReceiverList(
    @Query('userId') userId: string,
  ): Promise<ApiResponse<any>> {
    try {
      return this.doctorService.getOrganReceiverList(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return new ApiResponse(
          ApiResponseStatus.Error,
          undefined,
          'Patient not found.',
        );
      }
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching patient.',
      );
    }
  }

  @Get('organ-request-detail')
  @ApiOperation({
    summary: 'Functionality to get Organ Request Details',
    description:
      'This API helps to get all details related to particular organ request',
  })
  async getOrganRequestDetail(
    @Query('patientId') patientId: string,
    @Query('requestId') requestId: string,
  ): Promise<ApiResponse<any>> {
    try {
      return this.doctorService.getOrganRequestDetail(patientId, requestId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return new ApiResponse(
          ApiResponseStatus.Error,
          undefined,
          'Patient not found.',
        );
      }
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching patient.',
      );
    }
  }

  @Post('approval')
  @ApiOperation({
    summary: 'Doctors Approval',
    description:
      'This API helps to register doctors approval to corresponding organ request made by receiver',
  })
  async giveApproval(
    @Body() doctorApprovalDto: DoctorApprovalDto,
  ): Promise<ApiResponse<any>> {
    try {
      return this.doctorService.giveApproval(doctorApprovalDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return new ApiResponse(
          ApiResponseStatus.Error,
          undefined,
          'Patient not found.',
        );
      }
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching patient.',
      );
    }
  }
}
