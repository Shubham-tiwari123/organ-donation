import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDoctorDto } from 'src/dto/create-doctor-dto';
import { DoctorApprovalDto } from 'src/dto/doctor-approval.dto';
import { ApiResponse } from 'src/dto/response.dto';
import { ApiResponseStatus } from 'src/enum/api-response.enum';
import { Doctor, DoctorDocument } from 'src/schemas/doctor.schema';
import { Hospital, HospitalDocument } from 'src/schemas/hospital.schema';
import { Patient, PatientDocument } from 'src/schemas/patient.schema';

@Injectable()
export class DoctorService {

  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(Hospital.name) private hospitalModel: Model<HospitalDocument>
  ) { }

  async saveDoctorPersonalInfo(createDoctorDto: CreateDoctorDto): Promise<ApiResponse<any>> {
    
    const doctor = await this.doctorModel.findOne({ "userId": createDoctorDto.userId }).exec();
    if (doctor == null) {
      return new ApiResponse(ApiResponseStatus.Error, { message: "Doctor not found" })
    }
    const doctorJson = JSON.parse(JSON.stringify(doctor));
    delete createDoctorDto.personalInfo["email"]
    doctorJson["personalInfo"] = createDoctorDto.personalInfo
    doctorJson["hospitalId"] = createDoctorDto.hospitalId
    doctorJson["hospitalName"] = createDoctorDto.hospitalName

    await this.doctorModel.findOneAndUpdate({ "userId": createDoctorDto.userId }, createDoctorDto);
    return new ApiResponse(ApiResponseStatus.Success, { message: "Doctor personal info saved" })
  }

  async getDoctorPersonalInfo(id: string): Promise<ApiResponse<any>> {
    const doctorDetails = await this.doctorModel.findOne({ "userId": id }).exec();
    const doctorDetailsJson = JSON.parse(JSON.stringify(doctorDetails));
    const hospital = await this.hospitalModel.find({}).exec();
    const hospitalJson = JSON.parse(JSON.stringify(hospital));
    
    // get hospital list from hospital model
    let hospitalList = []

    hospitalJson.forEach(element => {
      let data = {
        hospitalId: element.userId,
        hospitalName: element.hospitalName
      }
      hospitalList.push(data)
    }); 
    
    if (doctorDetailsJson.personalInfo == undefined || doctorDetailsJson.personalInfo == null) {
      return new ApiResponse(ApiResponseStatus.Error, { message: "Doctor personal info not found", hospitalList, personalInfo: {email: doctorDetailsJson.email} })
    }
    let personalInfo = doctorDetailsJson.personalInfo
    doctorDetailsJson.personalInfo["hospitalId"] = doctorDetailsJson.hospitalId
    doctorDetailsJson.personalInfo["hospitalName"] = doctorDetailsJson.hospitalName
    doctorDetailsJson.personalInfo["email"] = doctorDetailsJson.email
    return new ApiResponse(ApiResponseStatus.Success, {personalInfo, hospitalList})
  }

  async getDonorList(hospitalId: string): Promise<ApiResponse<any>> {
    const donorList = await this.patientModel.find({ "hospitalId": hospitalId }).exec();
    const donorListJson = JSON.parse(JSON.stringify(donorList));

    let resultArray = []
    for (let i = 0; i < donorListJson.length; i++) {
      let userType = donorListJson[i]["userType"]
      if (userType.toLowerCase() == "donor") {
        donorListJson[i].organ.forEach((organ: { status: string; organ: any; }) => {
          let data = {
            id: donorListJson[i]["userId"],
            donorName: donorListJson[i]["personalInfo"] == null ? null : ['firstName'] + " " + donorListJson[i]["personalInfo"]['secondName'],
            organType: organ.organ,
            status: organ.status
          }
          resultArray.push(data)
        })

      }
    }

    return new ApiResponse(ApiResponseStatus.Success, { donorList: resultArray })
  }

  async getDonorDetails(patientId: string, organType: string): Promise<ApiResponse<any>> {
    const patientDetails = await this.patientModel.findOne({ "userId": patientId }).exec();
    const patientDetailsJson = JSON.parse(JSON.stringify(patientDetails));
    // let donorStatus = patientDetailsJson.userType.toLowerCase() == "donor" ? true : false
    let organ: any;
    
    patientDetailsJson.organ.forEach((element: { organ: string; }) => {
      if(element.organ.toLowerCase() === organType.toLowerCase()){
        organ = element;
      }
    });

    let data = {
      "firstName": patientDetailsJson.personalInfo.firstName,
      "secondName": patientDetailsJson.personalInfo.secondName,
      "email": patientDetailsJson.personalInfo.email,
      "dob": patientDetailsJson.personalInfo.dob,
      "phoneNumber": patientDetailsJson.personalInfo.phoneNumber,
      "gender": patientDetailsJson.personalInfo.gender,
      "bloodGroup": patientDetailsJson.medicalInfo.bloodGroup,
      "bmi": patientDetailsJson.medicalInfo.bmi,
      "height": patientDetailsJson.medicalInfo.height,
      "weight": patientDetailsJson.medicalInfo.weight,
      "donorStatus": true,
      "organName": [organ.organ],
      "organStatus": organ.status
    }
    return new ApiResponse(ApiResponseStatus.Success, data)
  }

  async getOrganReceiverList(doctorId: string): Promise<ApiResponse<any>> {
    const patientList = await this.patientModel.find({}).exec();
    const patientListJson = JSON.parse(JSON.stringify(patientList));
    let resultList = []

    for (let i = 0; i < patientListJson.length; i++) {
      const requestList = patientListJson[i].requestRaised;
      for (let j = 0; j < requestList.length; j++) {
        const requestDetails = JSON.parse(JSON.stringify(requestList[j]));
        if ((patientListJson[i].userType != "donor") && requestDetails.requestDetails['doctorId'] == doctorId) {
          let data = {
            patientId: patientListJson[i].userId,
            patientName: patientListJson[i].personalInfo.firstName + " " + patientListJson[i].personalInfo.secondName,
            priority: requestDetails.requestDetails['priority'],
            requestId: requestDetails['requestId']
          }
          resultList.push(data);
        }
      }
    }

    return new ApiResponse(ApiResponseStatus.Success, { requestList: resultList })
  }

  async getOrganRequestDetail(patientId: string, requestId: string): Promise<ApiResponse<any>> {
    const patientDetail = await this.patientModel.findOne({ "userId": patientId }).exec();
    const patientDetailJson = JSON.parse(JSON.stringify(patientDetail));
    let requestDetails = null
    for (let i = 0; i < patientDetailJson.requestRaised.length; i++) {
      if (patientDetailJson.requestRaised[i].requestId == requestId) {
        requestDetails = patientDetailJson.requestRaised[i];
        break;
      }
    }
    let data = requestDetails
    return new ApiResponse(ApiResponseStatus.Success, data)
  }

  async giveApproval(doctorApprovalDto: DoctorApprovalDto): Promise<ApiResponse<any>> {
    const userDetail = await this.patientModel.findOne({ "userId": doctorApprovalDto.patientId }).exec();
    const userDetailJson = JSON.parse(JSON.stringify(userDetail));
    console.log("doctorApprovalDto:",doctorApprovalDto);

    for (let i = 0; i < userDetailJson.requestRaised.length; i++) {
      if (userDetailJson.requestRaised[i].requestId == doctorApprovalDto.requestId) {
        if (doctorApprovalDto.approvalStatus) {
          userDetailJson.requestRaised[i].requestStage[2].currentStatus = "Done"
          userDetailJson.requestRaised[i].currentStatus = "Doctor Approved"
        } else {
          userDetailJson.requestRaised[i].requestStage[2].currentStatus = "Rejected"
          userDetailJson.requestRaised[i].currentStatus = "Doctor Rejected"
          userDetailJson.donorsRejected.push(doctorApprovalDto.donorId);

          // change organ status to false for donor id
          const donorDetail = await this.patientModel.findOne({ "userId": doctorApprovalDto.donorId }).exec();
          const donorJson = JSON.parse(JSON.stringify(donorDetail));

          for (let i = 0; i < donorJson.organ.length; i++) {
            if (donorJson.organ[i].organ.toLowerCase() == doctorApprovalDto.organRequest.toLowerCase()){
              donorJson.organ[i].status = "not donated"
            }
          }
          await this.patientModel.findOneAndUpdate({ "userId": doctorApprovalDto.donorId }, donorJson)
        }
        break;
      }
    }
    await this.patientModel.findOneAndUpdate({ "userId": doctorApprovalDto.patientId }, userDetailJson)
    return new ApiResponse(ApiResponseStatus.Success, { message: "record updated" })
  }

}
