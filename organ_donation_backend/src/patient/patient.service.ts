import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddPatientDetailsDto } from 'src/dto/add-patient-details.dto';
import { ApiResponse } from 'src/dto/response.dto';
import { UpdatePatientConsentDto } from 'src/dto/update-patient-consent.dto';
import { ApiResponseStatus } from 'src/enum/api-response.enum';
import { Patient, PatientDocument } from 'src/schemas/patient.schema';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
  ) { }

  async getAllPatientIds() {
    const patients = await this.patientModel.find({}).exec()
    const patientJson = JSON.parse(JSON.stringify(patients));
    let patientList = []
    patientJson.forEach(items => {
      if (items.medicalInfo == null || items.medicalInfo == undefined) {
        let data = {
          userId: items.userId,
          name: (items.personalInfo == null || items.personalInfo == undefined) ? "tryname" : `${items.personalInfo.firstName} ${items.personalInfo.secondName}`
        }
        patientList.push(data)
      }
    });
    return patientList;
  }

  async savePatientPersonalInfo(patientData: AddPatientDetailsDto): Promise<ApiResponse<any>> {
    const patient = await this.patientModel.findOne({ "userId": patientData.userId }).exec();
    if (patient == null) {
      return new ApiResponse(ApiResponseStatus.Error, { message: "Patient not found" })
    }
    const patientJson = JSON.parse(JSON.stringify(patient));
    delete patientData.personalInfo["email"]
    patientJson["personalInfo"] = patientData.personalInfo
    await this.patientModel.findOneAndUpdate({ "userId": patientData.userId }, patientJson);
    return new ApiResponse(ApiResponseStatus.Success, { message: "Patient personal info saved" })
  }

  async findAll(): Promise<PatientDocument[]> {
    return this.patientModel.find().exec();
  }

  async getPatientPersonalInfo(id: string): Promise<ApiResponse<any>> {
    const patient = await this.patientModel.findOne({ "userId": id }).exec();
    const patientJson = JSON.parse(JSON.stringify(patient))
    if (patientJson.personalInfo == undefined || patientJson.personalInfo == null) {
      return new ApiResponse(ApiResponseStatus.Error, { message: "Patient personal info not found", personalInfo: {email: patientJson.email} })
    }
    patientJson.personalInfo.email = patientJson.email
    return new ApiResponse(ApiResponseStatus.Success, { personalInfo: patientJson.personalInfo })
  }

  async getPatientMedicalDetail(patientId: string): Promise<ApiResponse<any>> {
    const patientDetails = await this.patientModel
      .findOne({ userId: patientId })
      .exec();
    const patientDetailsJson = JSON.parse(JSON.stringify(patientDetails));
    if (patientDetailsJson.medicalInfo == undefined || patientDetailsJson.medicalInfo == null) {
      return new ApiResponse(ApiResponseStatus.Error, { message: "Patient medical info not found" })
    }
    let organList = []
    patientDetailsJson.organ.forEach(organ => {
      organList.push(organ.organ)
    });
    patientDetailsJson.medicalInfo["organToDonate"] = organList
    let data = patientDetailsJson.medicalInfo
    return new ApiResponse(ApiResponseStatus.Success, data)
  }

  async getOrganRequestList(patientId: string): Promise<ApiResponse<any>> {
    const patientDetails = await this.patientModel
      .findOne({ userId: patientId })
      .exec();
    const patientDetailsJson = JSON.parse(JSON.stringify(patientDetails));

    let resultArray = []
    if (patientDetailsJson.requestRaised != null) {
      for (let i = 0; i < patientDetailsJson.requestRaised.length; i++) {
        // if (patientDetailsJson.requestRaised[i]["organProcedureStatus"]["transplant"] == null) {
          let patientId: any; 
          if(patientDetailsJson.userType == "donor") {
            patientId = patientDetailsJson.requestRaised[i].receiverId
          }else{
            patientId = patientDetailsJson.userId
          }
          let data = {
            requestId: patientDetailsJson.requestRaised[i].requestId,
            patientId: patientId,
            patientName: patientDetailsJson.personalInfo.firstName + " " + patientDetailsJson.personalInfo.secondName || null,
            priority: patientDetailsJson.requestRaised[i].priority == null ? 
              patientDetailsJson.requestRaised[i]["requestDetails"]["priority"].toLowerCase():
              patientDetailsJson.requestRaised[i].priority.toLowerCase()
          }

          resultArray.push(data)
        // }
      }
    }
    return new ApiResponse(ApiResponseStatus.Success, {
      requestList: resultArray,
    });
  }

  async getOrganRequestDetails(
    patientId: string,
    requestId: string,
  ): Promise<ApiResponse<any>> {
    const userDetail = await this.patientModel
      .findOne({ userId: patientId })
      .exec();
    const userDetailJson = JSON.parse(JSON.stringify(userDetail));
    console.log("Detailsss:",userDetailJson);
    
    let requestDetails: Object;
    let requestStage: Object;
    let takeDoctorApproval: boolean;
    let takePatientApproval: boolean;

    for (let i = 0; i < userDetailJson.requestRaised.length; i++) {
      if (userDetailJson.requestRaised[i].requestId == requestId) {
        requestDetails = userDetailJson.requestRaised[i].requestDetails
        requestStage = userDetailJson.requestRaised[i].requestStage
        takeDoctorApproval = userDetailJson.requestRaised[i].takeDoctorAprroval
        takePatientApproval = userDetailJson.requestRaised[i].takePatientAprroval
        break;
      }
    }
    return new ApiResponse(ApiResponseStatus.Success, { requestDetails, requestStage, takeDoctorApproval, takePatientApproval })
  }

  async updatePatientConsent(
    updatePatientConsent: UpdatePatientConsentDto,
  ): Promise<ApiResponse<any>> {
    console.log("updatePatientConsent:",updatePatientConsent);
    
    const userDetail = await this.patientModel
      .findOne({ userId: updatePatientConsent.patientId })
      .exec();
    const userDetailJson = JSON.parse(JSON.stringify(userDetail));
    
    for (let i = 0; i < userDetailJson.requestRaised.length; i++) {
      if (userDetailJson.requestRaised[i].requestId == updatePatientConsent.requestId) {
        if (updatePatientConsent.approvalStatus) {
          userDetailJson.requestRaised[i].requestStage[3].currentStatus = "Done"
          userDetailJson.requestRaised[i].currentStatus = "Patient Approved"
        } else {
          userDetailJson.requestRaised[i].requestStage[3].currentStatus = "Rejected"
          userDetailJson.requestRaised[i].currentStatus = "Patient Rejected"
          userDetailJson.donorsRejected.push(updatePatientConsent.donorId);

          // change organ status to false for donor id
          const donorDetail = await this.patientModel
            .findOne({ userId: updatePatientConsent.donorId })
            .exec();
          const donorJson = JSON.parse(JSON.stringify(donorDetail));

          for (let i = 0; i < donorJson.organ.length; i++) {
            if (donorJson.organ[i].organ.toLowerCase() == updatePatientConsent.organRequest.toLowerCase()){
              donorJson.organ[i].status = "not donated"
            }
          }
          await this.patientModel.findOneAndUpdate(
            { userId: updatePatientConsent.donorId },
            donorJson,
          );
        }

        break;
      }
    }
    await this.patientModel.findOneAndUpdate(
      { userId: updatePatientConsent.patientId },
      userDetailJson,
    );
    return new ApiResponse(ApiResponseStatus.Success, {
      message: 'record updated',
    });
  }

  async getNotification(patientId: string): Promise<ApiResponse<any>> {
    // console.log("getNotification:",patientId);
    
    const userDetail = await this.patientModel
      .findOne({ userId: patientId })
      .exec();
    const userDetailJson = JSON.parse(JSON.stringify(userDetail));
    let notificationList = userDetailJson.notificationList == null ? [] : userDetailJson.notificationList

    return new ApiResponse(ApiResponseStatus.Success, {
      notificationList
    });
  }
}
