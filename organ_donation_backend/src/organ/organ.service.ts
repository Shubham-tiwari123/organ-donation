import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrganReceivedDto } from 'src/dto/organ-received.dto';
import { OrganRemovedDto } from 'src/dto/organ-removed.dto';
import { OrganTransplantDto } from 'src/dto/organ-transplant.dto';
import { OrganTransportDto } from 'src/dto/organ-transport.dto';
import { ApiResponse } from 'src/dto/response.dto';
import { ApiResponseStatus } from 'src/enum/api-response.enum';
import { Patient, PatientDocument } from 'src/schemas/patient.schema';

@Injectable()
export class OrganService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
  ) {}

  async getOrganDetails(
    requestId: string,
    userId: string,
  ): Promise<ApiResponse<any>> {
    let userDetails = await this.patientModel.find({ userId: userId }).exec();
    let userDetailsJson = JSON.parse(JSON.stringify(userDetails));
    let organRequest = userDetailsJson[0]['requestRaised'];
    let organDetails = null;
    let transportationDetails = null;
    let receivingDetails = null;
    let transplantDetails = null;

    for (let i = 0; i < organRequest.length; i++) {
      console.log('Inside for loop');

      if (organRequest[i].requestId == requestId) {
        console.log('Match found:', i);
        organDetails =
          userDetailsJson[0]['requestRaised'][i]['organProcedureStatus'][
            'removed'
          ];
        organDetails["bloodGroup"] =  userDetailsJson[0]['requestRaised'][i]['requestDetails']['bloodGroup']
        organDetails["organType"] =  userDetailsJson[0]['requestRaised'][i]['requestDetails']['organRequired']
        organDetails["donorId"] =  userDetailsJson[0]['requestRaised'][i]['requestDetails']['donorId']
        transportationDetails =
          userDetailsJson[0]['requestRaised'][i]['organProcedureStatus'][
            'transport'
          ];
        receivingDetails =
          userDetailsJson[0]['requestRaised'][i]['organProcedureStatus'][
            'received'
          ];
        transplantDetails =
          userDetailsJson[0]['requestRaised'][i]['organProcedureStatus'][
            'transplant'
          ];
        break;
      }
    }

    
    return new ApiResponse(ApiResponseStatus.Success, {
      organDetails,
      transportationDetails,
      receivingDetails,
      transplantDetails,
    });
  }

  async saveOrganRemovedDetails(
    organRemovedDto: OrganRemovedDto,
  ): Promise<ApiResponse<any>> {

    // store the organ removed in patient requestRaised.removed array
    // update the status in requestStage
    // change organ donate status for donor

    let userDetails = await this.patientModel
      .findOne({ userId: organRemovedDto.patientId })
      .exec();

    let userDetailsJson = JSON.parse(JSON.stringify(userDetails));

    userDetailsJson.requestRaised.forEach(request => {
      if(request.requestId == organRemovedDto.requestId){
        request.requestStage[5].currentStatus = "Done"
        let data = {
          donorDoctorId: organRemovedDto.doctorId,
          donorDoctorName: organRemovedDto.doctorName,
          operationDate: organRemovedDto.operationDate,
          operationTime: organRemovedDto.operationTime
        }
        request.organProcedureStatus.removed = data
        request.currentStatus = "Organ Removed"
      }
    });
    const donorDetail = await this.patientModel.findOne({ "userId": organRemovedDto.donorId }).exec();
    let donorJson = JSON.parse(JSON.stringify(donorDetail));

    donorJson.organ.forEach(value => {
      if(value.organ.toLowerCase() == organRemovedDto.organRequest.toLowerCase()){
        value.status = "donated"
      }
    });

    await this.patientModel.findOneAndUpdate({ "userId": organRemovedDto.donorId }, donorJson)

    await this.patientModel.findOneAndUpdate({ userId: organRemovedDto.patientId },userDetailsJson);
    
    return new ApiResponse(ApiResponseStatus.Success, {
      message: 'request sent',
    });
  }

  async saveOrganTransportDetails(
    organTransportDto: OrganTransportDto,
  ): Promise<ApiResponse<any>> {
    let userDetails = await this.patientModel
      .findOne({ userId: organTransportDto.patientId })
      .exec();
    let userDetailsJson = JSON.parse(JSON.stringify(userDetails));

    userDetailsJson.requestRaised.forEach(request => {
      if(request.requestId == organTransportDto.requestId){
        request.requestStage[6].currentStatus = "Done"
        let data = {
          shippingTime: organTransportDto.shippingTime,
          shippingDate: organTransportDto.shippingTime,
          vehicleNumber: organTransportDto.vehicleNumber,
          createdAt: organTransportDto.createdAt
        }

        request.currentStatus = "Organ Transported"
        request.organProcedureStatus.transport = data
      }
    });

    await this.patientModel.findOneAndUpdate(
      { userId: organTransportDto.patientId },
      userDetailsJson,
    );
    return new ApiResponse(ApiResponseStatus.Success, {
      message: 'request sent',
    });
  }

  async saveOrganReceivedDetails(
    organReceivedDto: OrganReceivedDto,
  ): Promise<ApiResponse<any>> {
    let userDetails = await this.patientModel
      .findOne({ userId: organReceivedDto.patientId })
      .exec();
    let userDetailsJson = JSON.parse(JSON.stringify(userDetails));

    userDetailsJson.requestRaised.forEach(request => {
      if(request.requestId == organReceivedDto.requestId){
        request.requestStage[7].currentStatus = "Done"
        let data = {
          receivingTime: organReceivedDto.receivingTime,
          receivingDate: organReceivedDto.receivingDate,
          receiverDoctorName: organReceivedDto.doctorName,
          receiverDoctorId: organReceivedDto.doctorId,
          createdAt: organReceivedDto.createdAt
        }

        request.currentStatus = "Organ Received"
        request.organProcedureStatus.received = data
      }
    });

    await this.patientModel.findOneAndUpdate(
      { userId: organReceivedDto.patientId },
      userDetailsJson,
    );
    return new ApiResponse(ApiResponseStatus.Success, {
      message: 'request sent',
    });
  }

  async saveOrganTransplantDetails(
    organTransplantDto: OrganTransplantDto,
  ): Promise<ApiResponse<any>> {
    let userDetails = await this.patientModel
      .findOne({ userId: organTransplantDto.patientId })
      .exec();
    let userDetailsJson = JSON.parse(JSON.stringify(userDetails));

    userDetailsJson.requestRaised.forEach(request => {
      if(request.requestId == organTransplantDto.requestId){
        request.requestStage[8].currentStatus = "Done"
        let data = {
          operationDate: organTransplantDto.operationDate,
          operationTime: organTransplantDto.operationTime,
          operationDoctorName: organTransplantDto.doctorName,
          operationDoctorId: organTransplantDto.doctorId,
          operationStatus: organTransplantDto.operationStatus,
          createdAt: organTransplantDto.createdAt
        }

        request.currentStatus = "Transplant Done"
        request.organProcedureStatus.transplant = data
      }
    });

    await this.patientModel.findOneAndUpdate(
      { userId: organTransplantDto.patientId },
      userDetailsJson,
    );
    
    return new ApiResponse(ApiResponseStatus.Success, {
      message: 'request sent',
    });
  }
}
