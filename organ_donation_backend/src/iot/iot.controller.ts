import { Body, Controller, Query } from '@nestjs/common';
import { Get,Post } from '@nestjs/common';
import { IotService } from './iot.service';
import { ApiResponse } from 'src/dto/response.dto';
import { ApiResponseStatus } from 'src/enum/api-response.enum';
import { SensorDataDTO } from 'src/dto/sensor-data.dto';
import {
  ApiOperation,
  ApiTags,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';

@ApiTags('IoT APIs')
@Controller('iot')
export class IotController {
  constructor(private iotService:IotService){}

  @Get('sensor-data')
  @ApiOperation({
    summary: 'Sensor Data',
    description: 'This API provides information related to sensors by quering to blockchain',
  })
  async getSensorData(@Query('requestId') requestId: string): Promise<ApiResponse<any>>{
    return await this.iotService.querySensorData(parseInt(requestId))
  }

  @Post('sensor-data')
  @ApiOperation({
    summary: 'Save Sensor Data',
    description: 'This API provides provision to capture sensor data and store on blockchain ',
  })
  async saveSensorData(@Body() senserDataDTO: SensorDataDTO): Promise<ApiResponse<any>>{
    return await this.iotService.saveSensorData(senserDataDTO)
  }

  // @Post('update-iot-box')
  // @ApiOperation({
  //   summary: 'Update Sensor Data',
  //   description: 'This API provides provision to update sensor data related to request Id on blockchain',
  // })
  // async updateIOTBox(@Query("patientId") patientId: string): Promise<ApiResponse<any>>{
  //   return await this.iotService.updateIOTBox(patientId)
  // }

  // @Post('free-iotbox')
  // async freeIOTBox(@Query("patientId") patientId: string): Promise<ApiResponse<any>>{
  //   return await this.iotService.freeIOTBox(patientId)
  // }

}
