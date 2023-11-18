import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OrganService } from './organ.service';
import { ApiResponse } from 'src/dto/response.dto';
import { ApiResponseStatus } from 'src/enum/api-response.enum';
import { OrganRemovedDto } from 'src/dto/organ-removed.dto';
import { OrganTransportDto } from 'src/dto/organ-transport.dto';
import { OrganReceivedDto } from 'src/dto/organ-received.dto';
import { OrganTransplantDto } from 'src/dto/organ-transplant.dto';
import {
  ApiOperation,
  ApiTags,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';

@ApiTags('Organ APIs')
@Controller('organ')
export class OrganController {

  constructor(private readonly service: OrganService) { }

  @Post('save/organ-removed')
  @ApiOperation({
    summary: 'Organ Procedure API',
    description: 'This API helps to register the donors organ removal procedure success',
  })
  async saveOrganRemovedDetails(@Body() organRemovedDto: OrganRemovedDto): Promise<ApiResponse<any>> {
    try {
      console.log("Organ removed :", organRemovedDto);
      return await this.service.saveOrganRemovedDetails(organRemovedDto);
    } catch (error) {
      return new ApiResponse(ApiResponseStatus.Error, undefined, 'Error fetching items.');
    }
  }

  @Post('save/organ-transport')
  @ApiOperation({
    summary: 'Organ Transport',
    description: 'This API registers all the details related to transportation of the donors organ to receiver ',
  })
  async saveOrganTransportDetails(@Body() organTransportDto: OrganTransportDto): Promise<ApiResponse<any>> {
    try {
      console.log("Organ transport :", organTransportDto);
      return await this.service.saveOrganTransportDetails(organTransportDto);
    } catch (error) {
      console.log("Error:",error);
      return new ApiResponse(ApiResponseStatus.Error, undefined, 'Error fetching items.');
    }
  }

  @Post('save/organ-received')
  @ApiOperation({
    summary: 'Organ Transport',
    description: 'This API helps recipient to update system and log acknowledgement of organ being received successfully',
  })
  async saveOrganReceivedDetails(@Body() organReceivedDto: OrganReceivedDto): Promise<ApiResponse<any>> {
    try {
      console.log("Organ received :", organReceivedDto);
      return await this.service.saveOrganReceivedDetails(organReceivedDto);
    } catch (error) {
      return new ApiResponse(ApiResponseStatus.Error, undefined, 'Error fetching items.');
    }
  }

  @Post('save/organ-transplant')
  @ApiOperation({
    summary: 'Organ Transplant',
    description: 'This API helps to register the organ transplant procedure',
  })
  async saveOrganTransplantDetails(@Body() organTransplantDto: OrganTransplantDto): Promise<ApiResponse<any>> {
    try {
      console.log("Organ transplant :", organTransplantDto);
      return await this.service.saveOrganTransplantDetails(organTransplantDto);
    } catch (error) {
      return new ApiResponse(ApiResponseStatus.Error, undefined, 'Error fetching items.');
    }
  }

  @Get('organ-details')
  @ApiOperation({
    summary: 'Get Organ Details',
    description: 'This API provides detailed information of Organ Request made by Patient',
  })
  async getOrganDetails(@Query("requestId") requestId: string,@Query("userId") userId: string): Promise<ApiResponse<any>> {
    try {
      console.log("Organ transplant :", requestId);
      return await this.service.getOrganDetails(requestId, userId);
    } catch (error) {
      return new ApiResponse(ApiResponseStatus.Error, undefined, 'Error fetching items.');
    }
  }
}
