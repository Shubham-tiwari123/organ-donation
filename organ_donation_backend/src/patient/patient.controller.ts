import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { AddPatientDetailsDto } from 'src/dto/add-patient-details.dto';
import { UpdatePatientDto } from 'src/dto/update-patient.dto';
import { ApiResponse } from 'src/dto/response.dto';
import { ApiResponseStatus } from 'src/enum/api-response.enum';
import { UpdatePatientConsentDto } from 'src/dto/update-patient-consent.dto';
import {
  ApiOperation,
  ApiTags,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';

@ApiTags('Patient APIs')
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}
  @ApiOperation({
    summary: 'List Patients',
    description: 'Get A list of all patients',
  })
  @Get('allPatients')
  async getAllPatients(): Promise<ApiResponse<any>> {
    try {
      const patients = await this.patientService.getAllPatientIds();
      return new ApiResponse(ApiResponseStatus.Success, patients);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error while fetching all patient ids',
      );
    }
  }

  @Post('save/personal-detail')
  @ApiOperation({
    summary: 'Patient Personal Details',
    description: 'Save patients personal details',
  })
  async savePatientPersonalInfo(
    @Body() AddPatientDetailsDto: AddPatientDetailsDto,
  ): Promise<ApiResponse<any>> {
    try {
      const createdPatient = await this.patientService.savePatientPersonalInfo(
        AddPatientDetailsDto,
      );
      return new ApiResponse(ApiResponseStatus.Success, createdPatient);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error while adding patient personal details',
      );
    }
  }

  @Get('personal-detail')
  @ApiOperation({
    summary: 'Retrieve Patient Details',
    description: 'Get all details related to patient',
  })
  async getPatientPersonalInfo(
    @Query('id') id: string,
  ): Promise<ApiResponse<any>> {
    try {
      return await this.patientService.getPatientPersonalInfo(id);
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

  @Get('medical-detials')
  @ApiOperation({
    summary: 'Get Patients Medical Details',
    description: 'Get all medical details realted to patient',
  })
  async getPatientMedicalDetail(
    @Query('patientId') patientId: string,
  ): Promise<ApiResponse<any>> {
    try {
      return this.patientService.getPatientMedicalDetail(patientId);
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

  @Get('organ-list')
  @ApiOperation({
    summary: 'Get all organ related requests',
    description: 'This API returns all the organ requests made by patient',
  })
  async getOrganRequestList(
    @Query('patientId') patientId: string,
  ): Promise<ApiResponse<any>> {
    try {
      return this.patientService.getOrganRequestList(patientId);
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

  @Get('organ-detail')
  @ApiOperation({
    summary: 'Organ Request Details',
    description: 'This API provides information about particular organ request',
  })
  async getOrganRequestDetails(
    @Query('patientId') patientId: string,
    @Query('requestId') requestId: string,
  ): Promise<ApiResponse<any>> {
    try {
      return this.patientService.getOrganRequestDetails(patientId, requestId);
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

  @Post('consent')
  @ApiOperation({
    summary: 'Patient Consent API',
    description: 'This API registers patients consent',
  })
  async updatePatientConsent(
    @Body() updatePatientConsent: UpdatePatientConsentDto,
  ): Promise<ApiResponse<any>> {
    try {
      return this.patientService.updatePatientConsent(updatePatientConsent);
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

  @Get('notification')
  @ApiOperation({
    summary: 'List Notifications',
    description: 'This API lists all the notifications related to patient',
  })
  async getNotification(
    @Query('patientId') patientId: string,
  ): Promise<ApiResponse<any>> {
    try {
      return this.patientService.getNotification(patientId);
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
