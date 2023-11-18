import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { ApiResponse } from 'src/dto/response.dto';
import { ApiResponseStatus } from 'src/enum/api-response.enum';
import { AddMedicalRecordDto } from 'src/dto/add-medical-record.dto';
import { CreateOrganRequest } from 'src/dto/create-organ-request.dto';
import { OrganMatchRequestDto } from 'src/dto/organ-match-request.dto';
import { ApprovalRequestDto } from 'src/dto/approval-request.dto';
import { InformDonorDto } from 'src/dto/inform-donor.dto';
import { ApiOperation, ApiTags,ApiResponse as SwaggerApiResponse} from '@nestjs/swagger';


@ApiTags('Hospital APIs')
@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Get('doctorList')
  @ApiOperation({
    summary: 'List Doctors',
    description: 'Get A list of doctors for a hospital',
  })
  async getDoctorsList(
    @Query('hospitalId') hospitalId: string,
  ): Promise<ApiResponse<any>> {
    /**
     * Get a list of doctors for a hospital.
     * @param hospitalId The ID of the hospital.
     * @returns A list of doctors.
     */
    try {
      return this.hospitalService.getDoctorList(hospitalId);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching items.',
      );
    }
  }

  @Get('doctor')
  @ApiOperation({
    summary: 'Get Doctor Details',
    description: 'Get details of a doctor',
  })
  async getDoctorDetails(
    @Query('doctorId') doctorId: string,
  ): Promise<ApiResponse<any>> {
    try {
      /**
       * Get details of a doctor.
       * @param doctorId The ID of the doctor.
       * @returns Doctor details.
       */
      return this.hospitalService.getDoctorDetail(doctorId);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching items.',
      );
    }
  }

  @Get('patientList')
  @ApiOperation({
    summary: 'Get a list of patients for a hospital',
    description:
      'Retrieve a list of patients for a specific hospital using the hospital ID.',
  })
  async getPatientList(
    @Query('hospitalId') hospitalId: string,
  ): Promise<ApiResponse<any>> {
    try {
      /**
       * Get a list of patients for a hospital.
       * @param hospitalId The ID of the hospital.
       * @returns A list of patients.
       */
      return this.hospitalService.getPatientList(hospitalId);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching items.',
      );
    }
  }

  @Get('patient')
  @ApiOperation({
    summary: 'Get details of a patient by ID',
    description:
      'Retrieve detailed information about a patient using their unique identifier (ID).',
  })
  async getPatientDetails(
    @Query('patientId') patientId: string,
  ): Promise<ApiResponse<any>> {
    try {
      /**
       * Get details of a patient.
       * @param patientId The ID of the patient.
       * @returns Patient details.
       */
      return this.hospitalService.getPatientDetails(patientId);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching items.',
      );
    }
  }

  @Get('waitingList')
  @ApiOperation({
    summary: 'Get a list of patients on the waiting list',
    description:
      'Retrieve a list of patients who are on the waiting list for a specific hospital using the hospital ID.',
  })
  async getWaitingList(
    @Query('hospitalId') hospitalId: string,
  ): Promise<ApiResponse<any>> {
    try {
      /**
       * Get a list of patients on the waiting list for a hospital.
       * @param hospitalId The ID of the hospital.
       * @returns A list of patients on the waiting list.
       */
      return this.hospitalService.getWaitingList(hospitalId);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching items.',
      );
    }
  }

  @Get('iot/patientList')
  @ApiOperation({
    summary: 'Get a list of patients for a hospital via IoT',
    description:
      'Retrieve a list of patients for a specific hospital using IoT technology and the hospital ID.',
  })
  async getPatientListIOT(
    @Query('hospitalId') hospitalId: string,
  ): Promise<ApiResponse<any>> {
    try {
      /**
       * Get a list of patients for a hospital via IoT.
       * @param hospitalId The ID of the hospital.
       * @returns A list of patients.
       */

      return this.hospitalService.getPatientListIOT(hospitalId);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching items.',
      );
    }
  }

  @Get('waiting/details')
  @ApiOperation({
    summary: 'Get details of a waiting request',
    description:
      'Retrieve detailed information about a waiting request using the request ID and user ID.',
  })
  async getRequestDetails(
    @Query('requestId') requestId: string,
    @Query('userId') userId: string,
  ): Promise<ApiResponse<any>> {
    try {
      /**
       * Get details of a waiting request.
       * @param requestId The ID of the request.
       * @param userId The ID of the user.
       * @returns Request details.
       */
      return this.hospitalService.getRequestDetails(requestId, userId);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching items.',
      );
    }
  }

  @Get('/patient-doctor/list')
  @ApiOperation({
    summary: 'Get a list of patients assigned to doctors for a hospital',
    description:
      'Retrieve a list of patients assigned to doctors for a specific hospital using the hospital ID.',
  })
  async getDoctorPatientList(
    @Query('hospitalId') hospitalId: string,
  ): Promise<ApiResponse<any>> {
    try {
      /**
       * Get a list of patients assigned to doctors for a hospital.
       * @param hospitalId The ID of the hospital.
       * @returns A list of patients assigned to doctors.
       */
      return this.hospitalService.getDoctorPatientList(hospitalId);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching items.',
      );
    }
  }

  @Post('create/medical-record')
  @ApiOperation({
    summary: 'Create a new medical record',
    description:
      'Create a new medical record with the provided medical record data.',
  })
  async addMedicalRecords(
    @Body() medicalRecordDto: AddMedicalRecordDto,
  ): Promise<ApiResponse<any>> {
    try {
      /**
       * Create a new medical record.
       * @param medicalRecordDto The medical record data.
       * @returns An API response.
       */
      // console.log("Medical record:",medicalRecordDto);
      return this.hospitalService.addMedicalRecords(medicalRecordDto);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching items.',
      );
    }
  }

  @Post('update/medical-record')
  @ApiOperation({
    summary: 'Update a medical record',
    description:
      'Update an existing medical record with the provided updated data.',
  })
  async updateMedicalRecord(
    @Body() medicalRecordDto: AddMedicalRecordDto,
  ): Promise<ApiResponse<any>> {
    try {
      /**
       * Update a medical record.
       * @param medicalRecordDto The updated medical record data.
       * @returns An API response.
       */
      console.log('Medical record:', medicalRecordDto);
      return this.hospitalService.updateMedicalRecords(medicalRecordDto);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching items.',
      );
    }
  }

  @Post('create/new-request')
  @ApiOperation({
    summary: 'Create a new organ request',
    description:
      'Create a new organ request with the provided organ request data.',
  })
  async createNewOrganRequest(
    @Body() organRequest: CreateOrganRequest,
  ): Promise<ApiResponse<any>> {
    try {
      /**
       * Create a new organ request.
       * @param organRequest The organ request data.
       * @returns An API response.
       */
      console.log('New organ request:', organRequest);
      return this.hospitalService.createNewOrganRequest(organRequest);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching items.',
      );
    }
  }

  @Post('request/find-match')
  @ApiOperation({
    summary: 'Find a suitable organ match for a given request',
    description:
      'Find and return information about a suitable organ match for the provided organ match request data.',
  })
  async findOrganMatch(
    @Body() organMatchRequest: OrganMatchRequestDto,
  ): Promise<ApiResponse<any>> {
    try {
      /**
       * Find a suitable organ match for a given request.
       * @param organMatchRequest The organ match request data.
       * @returns An API response with the organ match information.
       */

      return await this.hospitalService.findOrganMatch(organMatchRequest);
    } catch (error) {
      console.log('Error:', error);
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching items.',
      );
    }
  }

  @Post('request/change-organ-status')
  @ApiOperation({
    summary: 'Change the status of an organ request',
    description:
      'Change the status of an organ request using the provided parameters with status changes.',
  })
  async changeOrganStatus(
    @Body() params: OrganMatchRequestDto,
  ): Promise<ApiResponse<any>> {
    try {
      /**
       * Change the status of an organ request.
       * @param params The organ request data with status changes.
       * @returns An API response.
       */
      // console.log("New organ request:", params);
      return this.hospitalService.changeOrganStatus(params);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching items.',
      );
    }
  }

  @Post('request/doctor-approval')
  @ApiOperation({
    summary: 'Request doctor approval for an organ transplant',
    description:
      'Send a request for doctor approval for an organ transplant with the provided approval request data.',
  })
  async takeDoctorApproval(
    @Body() approvalRequest: ApprovalRequestDto,
  ): Promise<ApiResponse<any>> {
    try {
      /**
       * Request doctor approval for an organ transplant.
       * @param approvalRequest The approval request data.
       * @returns An API response with the approval status.
       */
      console.log('Doctor approval:', approvalRequest);
      return this.hospitalService.takeDoctorApproval(approvalRequest);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching items.',
      );
    }
  }

  @Post('request/patient-consent')
  @ApiOperation({
    summary: 'Request patient consent for an organ transplant',
    description:
      'Send a request for patient consent for an organ transplant with the provided consent request data.',
  })
  async takePatientApproval(
    @Body() approvalRequest: ApprovalRequestDto,
  ): Promise<ApiResponse<any>> {
    try {
      /**
       * Request patient consent for an organ transplant.
       * @param approvalRequest The consent request data.
       * @returns An API response with the consent status.
       */
      console.log('Patient approval:', approvalRequest);
      return this.hospitalService.takePatientApproval(approvalRequest);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching items.',
      );
    }
  }

  @Post('request/inform-donor')
  @ApiOperation({
    summary: 'Inform a donor about an organ request',
    description:
      'Inform a donor about a specific organ request using the provided donor inform request data.',
  })
  async informDonor(
    @Body() request: InformDonorDto,
  ): Promise<ApiResponse<any>> {
    try {
      /**
       * Inform a donor about an organ request.
       * @param request The donor inform request.
       * @returns An API response.
       */
      console.log('Inform donor:', request);
      return this.hospitalService.informDonor(request);
    } catch (error) {
      return new ApiResponse(
        ApiResponseStatus.Error,
        undefined,
        'Error fetching items.',
      );
    }
  }
}
