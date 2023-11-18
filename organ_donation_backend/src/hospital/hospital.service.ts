import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddMedicalRecordDto } from 'src/dto/add-medical-record.dto';
import { ApprovalRequestDto } from 'src/dto/approval-request.dto';
import { CreateOrganRequest } from 'src/dto/create-organ-request.dto';
import { InformDonorDto } from 'src/dto/inform-donor.dto';
import { OrganMatchRequestDto } from 'src/dto/organ-match-request.dto';
import { ApiResponse } from 'src/dto/response.dto';
import { ApiResponseStatus } from 'src/enum/api-response.enum';
import { IotService } from 'src/iot/iot.service';
import { Doctor, DoctorDocument } from 'src/schemas/doctor.schema';
import { Patient, PatientDocument } from 'src/schemas/patient.schema';

@Injectable()
export class HospitalService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @Inject(IotService) private readonly iotService: IotService
  ) { }

  async getDoctorList(hospitalId: String): Promise<ApiResponse<any>> {
    const doctorList = await this.doctorModel
      .find({ hospitalId: hospitalId })
      .exec();
    const doctorListJson = JSON.parse(JSON.stringify(doctorList));
    let resultArray = [];
    for (let i = 0; i < doctorListJson.length; i++) {
      let data = {
        id: doctorListJson[i]['userId'],
        doctorName:
          doctorListJson[i]['personalInfo']['firstName'] +
          ' ' +
          doctorListJson[i]['personalInfo']['secondName'],
      };
      resultArray.push(data);
    }

    return new ApiResponse(ApiResponseStatus.Success, {
      doctorList: resultArray,
    });
  }

  async getDoctorDetail(doctorId: String): Promise<ApiResponse<any>> {
    const doctorDetail = await this.doctorModel
      .find({ userId: doctorId })
      .exec();
    const doctorDetailJson = JSON.parse(JSON.stringify(doctorDetail));
    return new ApiResponse(ApiResponseStatus.Success, {
      doctorProfile: doctorDetailJson[0],
    });
  }

  async getDonorList(hospitalId: String): Promise<ApiResponse<any>> {
    const donorList = await this.patientModel
      .find({ hospitalId: hospitalId })
      .exec();
    const donorListJson = JSON.parse(JSON.stringify(donorList));

    let resultArray = [];
    for (let i = 0; i < donorListJson.length; i++) {
      let userType = donorListJson[i]['userType'];
      if (userType.toLowerCase() == 'donor') {
        console.log('Organ list:', donorListJson[i].organ);
        donorListJson[i].organ.forEach(
          (organ: { status: string; organ: any }) => {
            if (organ.status == 'not donated') {
              let data = {
                id: donorListJson[i]['userId'],
                donorName:
                  donorListJson[i]['personalInfo'] == null
                    ? null
                    : donorListJson[i]['personalInfo']['firstName'] +
                    ' ' +
                    donorListJson[i]['personalInfo']['secondName'],
                organType: organ.organ,
              };
              resultArray.push(data);
            }
          },
        );
      }
    }

    return new ApiResponse(ApiResponseStatus.Success, {
      donorList: resultArray,
    });
  }

  async getPatientList(hospitalId: String): Promise<ApiResponse<any>> {
    const donorList = await this.patientModel
      .find({ hospitalId: hospitalId })
      .exec();
    const donorListJson = JSON.parse(JSON.stringify(donorList));

    let resultArray = [];
    for (let i = 0; i < donorListJson.length; i++) {
      let userType = donorListJson[i]['userType'];
      let data = {
        id: donorListJson[i]['userId'],
        donorName: donorListJson[i]['personalInfo'] == null ? null : donorListJson[i]['personalInfo']['firstName'] + ' ' + donorListJson[i]['personalInfo']['secondName'],
        patientType: userType
      }
      resultArray.push(data)
    }

    return new ApiResponse(ApiResponseStatus.Success, {
      donorList: resultArray,
    });
  }

  async getPatientDetails(patientId: String): Promise<ApiResponse<any>> {
    const donorDetailDb = await this.patientModel
      .find({ userId: patientId })
      .exec();

    const donorDetailsJson = JSON.parse(JSON.stringify(donorDetailDb));
    let donorDetails =
      donorDetailsJson[0]['medicalInfo'] == null
        ? null
        : donorDetailsJson[0]['medicalInfo'];

    let organToDonate =
      donorDetailsJson[0]['organ'] == null
        ? null
        : donorDetailsJson[0]['organ'];

    donorDetails.name = donorDetailsJson[0]['personalInfo'] == null ? "tryname" :
      donorDetailsJson[0]['personalInfo']["firstName"] + " " + donorDetailsJson[0]['personalInfo']["secondName"];

    return new ApiResponse(ApiResponseStatus.Success, {
      donorDetails,
      organToDonate,
    });
  }

  async getWaitingList(hospitalId: string): Promise<ApiResponse<any>> {
    const waitingList = await this.patientModel
      .find({ hospitalId: hospitalId })
      .exec();
    const waitingListJson = JSON.parse(JSON.stringify(waitingList));
    console.log('total request found:', waitingListJson.length);
    let resultArray = [];

    for (let i = 0; i < waitingListJson.length; i++) {
      // if (waitingListJson[i].userType.toLowerCase() != 'donor') {
      for (let j = 0; j < waitingListJson[i]['requestRaised'].length; j++) {
        // if (waitingListJson[i]['requestRaised'][j]['organProcedureStatus']['transplant'] == null) {

        let data = {
          requestId: waitingListJson[i]['requestRaised'][j]['requestId'],
          patientId: waitingListJson[i]['requestRaised'][j]['receiverId'] == null ? waitingListJson[i]['userId'] : waitingListJson[i]['requestRaised'][j]['receiverId'],
          patientName:
            waitingListJson[i]['personalInfo']['firstName'] +
            ' ' +
            waitingListJson[i]['personalInfo']['secondName'] || null,
          priority: waitingListJson[i]['requestRaised'][j]['priority'] == null ?
            waitingListJson[i]['requestRaised'][j]['requestDetails']['priority'].toLowerCase() : waitingListJson[i]['requestRaised'][j]['priority'].toLowerCase(),
          currentStage:
            waitingListJson[i]['requestRaised'][j]['currentStatus'] == null ? "Not Found" :
              waitingListJson[i]['requestRaised'][j]['currentStatus'],
        };

        resultArray.push(data);
        // }
        // }
      }
    }
    return new ApiResponse(ApiResponseStatus.Success, {
      requestList: resultArray,
    });
  }

  async getPatientListIOT(hospitalId: string): Promise<ApiResponse<any>> {
    const waitingList = await this.patientModel
      .find({ hospitalId: hospitalId })
      .exec();
    const waitingListJson = JSON.parse(JSON.stringify(waitingList));
    console.log('total request found:', waitingListJson.length);
    let resultArray = [];

    for (let i = 0; i < waitingListJson.length; i++) {
      // if (waitingListJson[i].userType.toLowerCase() == 'patient') {
      for (let j = 0; j < waitingListJson[i]['requestRaised'].length; j++) {
        // if (waitingListJson[i]['requestRaised'][j]['organProcedureStatus']['transplant'] == null) {

        let data = {
          requestId: waitingListJson[i]['requestRaised'][j]['requestId'],
          patientId: waitingListJson[i]['requestRaised'][j]['receiverId'] == null ? waitingListJson[i]['userId'] : waitingListJson[i]['requestRaised'][j]['receiverId'],
          patientName:
            waitingListJson[i]['personalInfo']['firstName'] +
            ' ' +
            waitingListJson[i]['personalInfo']['secondName'] || null
        };

        resultArray.push(data);
        // }
        // }
      }
    }
    let iotStatus = await this.iotService.getIOTBoxStatus()
    return new ApiResponse(ApiResponseStatus.Success, {
      requestList: resultArray,
      iotStatus
    });
  }

  async getRequestDetails(
    requestId: string,
    userId: string,
  ): Promise<ApiResponse<any>> {
    const userDetail = await this.patientModel
      .findOne({ userId: userId })
      .exec();
    const userDetailJson = JSON.parse(JSON.stringify(userDetail));
    // console.log('userDetails:', userDetailJson);
    let requestDetails: Object;
    let requestStage: Object;
    let takeDoctorApproval: boolean;
    let takePatientApproval: boolean;

    for (let i = 0; i < userDetailJson.requestRaised.length; i++) {
      if (userDetailJson.requestRaised[i].requestId == requestId) {
        requestDetails = userDetailJson.requestRaised[i].requestDetails;
        requestStage = userDetailJson.requestRaised[i].requestStage;
        takeDoctorApproval = userDetailJson.requestRaised[i].takeDoctorAprroval;
        takePatientApproval =
          userDetailJson.requestRaised[i].takePatientAprroval;
        break;
      }
    }

    // get IOT details 
    const iotResponse = await this.iotService.querySensorData(parseInt(requestId));

    if (requestDetails["donorHospitalId"] == null && requestDetails["donorId"]!=null) {
      let donorId = requestDetails["donorId"]
      const donorDetail = await this.patientModel
        .findOne({ userId: donorId })
        .exec();

      const donorJson = JSON.parse(JSON.stringify(donorDetail));
      requestDetails["donorHospitalId"] = donorJson.hospitalId
      requestDetails["donorName"] = donorDetail['personalInfo']['firstName'] + ' ' + donorDetail['personalInfo']['secondName']
    }

    return new ApiResponse(ApiResponseStatus.Success, {
      requestDetails,
      requestStage,
      takeDoctorApproval,
      takePatientApproval,
      iotResponse
    });
  }

  async getDoctorPatientList(hospitalId: string): Promise<ApiResponse<any>> {
    let patientList = []
    let doctorList = []
    const patient = await this.patientModel.find({ hospitalId: hospitalId }).exec();
    const patientJson = JSON.parse(JSON.stringify(patient));

    const doctor = await this.doctorModel.find({ hospitalId: hospitalId }).exec();
    const doctorJson = JSON.parse(JSON.stringify(doctor));

    patientJson.forEach(patient => {
      if (patient.userType.toLowerCase() != "donor") {
        let data = {
          id: patient.userId,
          name: patient.personalInfo.firstName + " " + patient.personalInfo.secondName,
          bmi: patient.medicalInfo.bmi,
          bloodGroup: patient.medicalInfo.bloodGroup
        }
        patientList.push(data)
      }
    });

    doctorJson.forEach(doctor => {
      let data = {
        id: doctor.userId,
        doctorName: doctor.personalInfo.firstName + " " + doctor.personalInfo.secondName
      }

      doctorList.push(data)
    })


    return new ApiResponse(ApiResponseStatus.Success, { doctorList, patientList });
  }

  async addMedicalRecords(
    addMedicalRecordDto: AddMedicalRecordDto,
  ): Promise<ApiResponse<any>> {
    const userDetail = await this.patientModel
      .findOne({ userId: addMedicalRecordDto.patientId })
      .exec();
    let userDetailJson = JSON.parse(JSON.stringify(userDetail));
    let patientId = addMedicalRecordDto.patientId;

    if (addMedicalRecordDto.donorStatus) {
      userDetailJson.userType = "donor";
      let organToDonate = []
      addMedicalRecordDto.organList.forEach((organ) => {
        let data = {
          status: "not donated",
          organ
        }
        organToDonate.push(data)
      })
      userDetailJson.organ = organToDonate
      userDetailJson.hospitalId = addMedicalRecordDto.createdBy
      delete addMedicalRecordDto.createdBy
      delete addMedicalRecordDto.organList;
      delete addMedicalRecordDto.patientId;
      delete addMedicalRecordDto.patientName;
      userDetailJson.medicalInfo = addMedicalRecordDto;
    } else {
      userDetailJson.userType = "patient";
      userDetailJson.hospitalId = addMedicalRecordDto.createdBy
      delete addMedicalRecordDto.createdBy
      delete addMedicalRecordDto.patientId;
      delete addMedicalRecordDto.organList;
      delete addMedicalRecordDto.patientName;
      userDetailJson.medicalInfo = addMedicalRecordDto;
      userDetailJson.organ = []
    }
    // console.log("UserDetailsJson:", userDetailJson);

    await this.patientModel.findOneAndUpdate({ "userId": patientId }, userDetailJson)
    return new ApiResponse(ApiResponseStatus.Success, { message: "record added" })
  }

  // update patient to donor or donor to patient
  async updateMedicalRecords(
    addMedicalRecordDto: AddMedicalRecordDto,
  ): Promise<ApiResponse<any>> {
    const userDetail = await this.patientModel
      .findOne({ userId: addMedicalRecordDto.patientId })
      .exec();
    let userDetailJson = JSON.parse(JSON.stringify(userDetail));
    let patientId = addMedicalRecordDto.patientId;

    if (addMedicalRecordDto.donorStatus) {
      userDetailJson.userType = "donor";
      let organToDonate = []
      addMedicalRecordDto.organList.forEach((organ) => {
        let data = {
          status: "not donated",
          organ
        }
        organToDonate.push(data)
      })
      userDetailJson.organ = organToDonate
      userDetailJson.hospitalId = addMedicalRecordDto.createdBy
      delete addMedicalRecordDto.createdBy
      delete addMedicalRecordDto.organList;
      delete addMedicalRecordDto.patientId;
      delete addMedicalRecordDto.patientName;
      userDetailJson.medicalInfo = addMedicalRecordDto;
    } else {
      userDetailJson.userType = "patient";
      userDetailJson.hospitalId = addMedicalRecordDto.createdBy
      delete addMedicalRecordDto.createdBy
      delete addMedicalRecordDto.patientId;
      delete addMedicalRecordDto.organList;
      delete addMedicalRecordDto.patientName;
      userDetailJson.medicalInfo = addMedicalRecordDto;
      userDetailJson.organ = []
    }
    await this.patientModel.findOneAndUpdate({ "userId": patientId }, userDetailJson)
    return new ApiResponse(ApiResponseStatus.Success, { message: "record updated" })
  }

  async createNewOrganRequest(
    organRequest: CreateOrganRequest,
  ): Promise<ApiResponse<any>> {
    const userDetail = await this.patientModel
      .findOne({ userId: organRequest.patientId })
      .exec();
    let userDetailJson = JSON.parse(JSON.stringify(userDetail));
    let requestId = organRequest.requestId
    let patientId = organRequest.patientId;

    delete organRequest.requestId
    delete organRequest.patientId

    let requestDetails = organRequest
    let organProcedureStatus = {
      removed: null,
      transport: null,
      received: null,
      transplant: null,
    };
    let requestStage = [
      {
        id: 1,
        currentStage: 'Created',
        currentStatus: 'Done',
      },
      {
        id: 2,
        currentStage: 'Find Match',
        currentStatus: 'Pending',
      },
      {
        id: 3,
        currentStage: 'Patient Doctor Approval',
        currentStatus: 'Pending',
      },
      {
        id: 4,
        currentStage: 'Patient Consent',
        currentStatus: 'Pending',
      },
      {
        id: 5,
        currentStage: 'Donor Agreed',
        currentStatus: 'Pending',
      },
      {
        id: 6,
        currentStage: 'Organ Removed',
        currentStatus: 'Pending',
      },
      {
        id: 7,
        currentStage: 'Organ Transported',
        currentStatus: 'Pending',
      },
      {
        id: 8,
        currentStage: 'Organ Received',
        currentStatus: 'Pending',
      },
      {
        id: 9,
        currentStage: 'Organ Transplant',
        currentStatus: 'Pending',
      },
    ];

    let data = {
      requestId,
      currentStatus: "Created",
      requestDetails,
      organProcedureStatus,
      takeDoctorAprroval: false,
      takePatientAprroval: false,
      requestStage,
    };

    console.log("Data:", data);

    userDetailJson.requestRaised.push(data);
    await this.patientModel.findOneAndUpdate({ "userId": patientId }, userDetailJson)
    return new ApiResponse(ApiResponseStatus.Success, { message: "record updated" })
  }

  async findOrganMatch(
    organMatchRequest: OrganMatchRequestDto,
  ): Promise<ApiResponse<any>> {
    console.log("organMatchRequest:", organMatchRequest);

    const patient = await this.patientModel
      .findOne({ userId: organMatchRequest.patientId })
      .exec();
    const patientJson = JSON.parse(JSON.stringify(patient));
    const patientMedicalInfo = patientJson.medicalInfo;
    const patientRaiseRequest = patientJson.requestRaised;
    let patientPrority;
    let requestCreationDate;

    for (let i = 0; i < patientRaiseRequest.length; i++) {
      if (patientRaiseRequest[i].requestId == organMatchRequest.requestId) {
        patientPrority = patientRaiseRequest[i].requestDetails.priority;
        requestCreationDate =
          patientRaiseRequest[i].requestDetails.createdAt;
        break;
      }
    }

    const donorList = await this.patientModel
      .find({ userType: 'donor' })
      .exec();
    const donorListJson = JSON.parse(JSON.stringify(donorList));

    let bestMatch: any = null;
    let highestCompatibilityScore = 3;
    let finalStatus = false;
    let finalMessage = null;

    for (const donor of donorListJson) {
      const isDonorRejected: boolean = this.checkIfDonorReject(
        patient.donorsRejected,
        donor.userId,
      );
      if (isDonorRejected) {
        console.log("Donor rejected!!");
        finalMessage = "Donor not found"
        continue;
      }
      const { status, message, compatibilityScore } = this.calculateCompatibilityScore(
        patientMedicalInfo,
        requestCreationDate,
        patientPrority,
        organMatchRequest.organRequest,
        donor,
      );
      console.log("Status:", status, "message:", message, "compatibilityScore:", compatibilityScore, "highestCompatibilityScore:", highestCompatibilityScore);

      finalMessage = message

      if (compatibilityScore >= highestCompatibilityScore) {
        highestCompatibilityScore = compatibilityScore;
        bestMatch = donor;
        finalMessage = message;
      }
    }

    if (bestMatch == null) {
      return new ApiResponse(ApiResponseStatus.Error, {
        message: finalMessage,
      });
    }

    console.log("BestMatch:", bestMatch);

    console.log(
      `Best match: ${bestMatch} & compatibility score:${highestCompatibilityScore}`,
    );

    const result = {
      donor: bestMatch.userId,
      donorName: bestMatch.personalInfo.firstName + " " + bestMatch.personalInfo.secondName,
      compatibilityScore: highestCompatibilityScore,
      requestId: organMatchRequest.requestId,
    };
    return new ApiResponse(ApiResponseStatus.Success, {
      result: result,
      message: 'Match Found',
    });
  }

  private checkIfDonorReject(donorRejectList, donorId): boolean {
    for (let i = 0; i < donorRejectList.length; i++) {
      if (donorRejectList[i] == donorId) {
        return true;
      }
    }
    return false;
  }

  private calculateCompatibilityScore(
    patientMedicalInfo: any,
    requestCreationDate,
    patientPrority,
    requiredOrgan: string,
    donor: any,
  ) {
    let compatibilityScore = 0;
    let isOrganAvailable = false;
    for (let i = 0; i < donor.organ.length; i++) {
      if (
        donor.organ[i].organ == requiredOrgan &&
        donor.organ[i].status == 'not donated'
      ) {
        isOrganAvailable = true;
        break;
      }
    }
    console.log('organ availablity: ', isOrganAvailable);

    if (isOrganAvailable) {
      let bloodGroupCheck = this.bloodCompatibilityCheck(
        patientMedicalInfo.bloodGroup,
        donor.medicalInfo.bloodGroup,
      );
      console.log('blood group check: ', bloodGroupCheck);
      if (bloodGroupCheck) {
        const donorBMI = donor.medicalInfo.bmi;
        const patientBMI = patientMedicalInfo.bmi;

        console.log(`Patient BMI:${patientBMI} donorBMI: ${donorBMI}`);

        const BMIDifference = Math.abs(patientBMI - donorBMI);

        console.log('BMI Difference: ', BMIDifference);

        if (BMIDifference <= 1) {
          compatibilityScore += 3;
        } else if (BMIDifference <= 3) {
          compatibilityScore += 2;
        } else if (BMIDifference <= 5) {
          compatibilityScore += 1;
        }

        const patientUrgency = patientPrority;

        console.log('patient urgency: ', patientUrgency);

        if (patientUrgency.toLowerCase() === 'high') {
          compatibilityScore += 3;
        } else if (patientUrgency.toLowerCase() === 'medium') {
          compatibilityScore += 2;
        } else if (patientUrgency.toLowerCase() === 'low') {
          compatibilityScore += 1;
        }
        const currentTime = new Date().getTime();
        const requestRegisteredOn = new Date(requestCreationDate).getTime();
        const waitingTimeInDays = Math.floor(
          (currentTime - requestRegisteredOn) / (24 * 60 * 60 * 1000),
        );

        if (waitingTimeInDays >= 0 && waitingTimeInDays <= 30) {
          compatibilityScore += 1;
        } else if (waitingTimeInDays > 30 && waitingTimeInDays <= 90) {
          compatibilityScore += 2;
        } else if (waitingTimeInDays > 90 && waitingTimeInDays <= 180) {
          compatibilityScore += 3;
        }
      } else {
        return { status: false, message: "Blood group not found", compatibilityScore };
      }
    } else {
      // return compatibilityScore;
      return { status: false, message: "Organ not found", compatibilityScore }
    }
    return { status: true, message: "Organ found", compatibilityScore };
  }

  private bloodCompatibilityCheck(
    patientBloodGroup: string,
    donorBloodGroup: string,
  ) {
    console.log(
      `Logging blood groups: patient ${patientBloodGroup} and ${donorBloodGroup}`,
    );
    if (
      donorBloodGroup == 'A+' ||
      (donorBloodGroup == 'A-' && patientBloodGroup == 'A+') ||
      patientBloodGroup == 'A-' ||
      patientBloodGroup == 'AB+' ||
      patientBloodGroup == 'AB-'
    ) {
      return true;
    } else if (
      donorBloodGroup == 'B+' ||
      (donorBloodGroup == 'B-' && patientBloodGroup == 'B+') ||
      patientBloodGroup == 'B-' ||
      patientBloodGroup == 'AB+' ||
      patientBloodGroup == 'AB-'
    ) {
      return true;
    } else if (
      donorBloodGroup == 'AB+' ||
      (donorBloodGroup == 'AB-' && patientBloodGroup == 'AB+') ||
      patientBloodGroup == 'AB-'
    ) {
      return true;
    } else if (
      donorBloodGroup == 'O+' ||
      (donorBloodGroup == 'O-' && patientBloodGroup == 'A+') ||
      patientBloodGroup == 'A-' ||
      patientBloodGroup == 'B+' ||
      patientBloodGroup == 'B-' ||
      patientBloodGroup == 'AB+' ||
      patientBloodGroup == 'AB-'
    ) {
      return true;
    } else {
      return false;
    }
  }

  async changeOrganStatus(
    params: OrganMatchRequestDto,
  ): Promise<ApiResponse<any>> {
    const donor = await this.patientModel
      .findOne({ userId: params.donorId })
      .exec();

    const patient = await this.patientModel
      .findOne({ userId: params.patientId })
      .exec();

    const donorJson = JSON.parse(JSON.stringify(donor));
    const patientJson = JSON.parse(JSON.stringify(patient));

    let priority;
    let currentStage;

    patientJson.requestRaised.forEach(requests => {
      if (requests.requestId == params.requestId) {
        requests.requestStage[1].currentStatus = "Done"
        requests.requestDetails["donorId"] = params.donorId
        requests.currentStatus = "Organ Found"
        priority = requests.requestDetails.priority
        currentStage = requests.currentStatus
      }
    });

    for (let i = 0; i < donorJson.organ.length; i++) {
      if (donorJson.organ[i].organ.toLowerCase() == params.organRequest.toLowerCase()) {
        donorJson.organ[i].status = 'match found';
        let data = {
          requestId: params.requestId,
          receiverId: params.patientId,
          priority: priority,
          currentStatus: currentStage,
          patientName: patientJson.personalInfo.firstName + " " + patientJson.personalInfo.secondName
        }
        donorJson.requestRaised.push(data);
      }
    }

    await this.patientModel.findOneAndUpdate(
      { userId: params.patientId },
      patientJson,
    );

    await this.patientModel.findOneAndUpdate(
      { userId: params.donorId },
      donorJson,
    );

    return new ApiResponse(ApiResponseStatus.Success, {
      message: 'status changed',
    });
  }

  async takeDoctorApproval(
    approvalRequest: ApprovalRequestDto,
  ): Promise<ApiResponse<any>> {
    const userDetail = await this.patientModel
      .findOne({ userId: approvalRequest.patientId })
      .exec();
    let userDetailJson = JSON.parse(JSON.stringify(userDetail));

    for (let i = 0; i < userDetailJson.requestRaised.length; i++) {
      if (
        userDetailJson.requestRaised[i].requestId == approvalRequest.requestId
      ) {
        userDetailJson.requestRaised[i].takeDoctorAprroval = true;
        userDetailJson.requestRaised[i].requestStage[2].currentStatus = "Requested"
        userDetailJson.requestRaised[i].currentStatus = "Doctor Approval"
        break;
      }
    }
    console.log("Take approval:", userDetailJson.requestRaised[0].requestStage[2]);

    await this.patientModel.findOneAndUpdate(
      { userId: approvalRequest.patientId },
      userDetailJson,
    );


    return new ApiResponse(ApiResponseStatus.Success, {
      message: 'request sent',
    });
  }

  async takePatientApproval(
    approvalRequest: ApprovalRequestDto,
  ): Promise<ApiResponse<any>> {
    const userDetail = await this.patientModel
      .findOne({ userId: approvalRequest.patientId })
      .exec();
    let userDetailJson = JSON.parse(JSON.stringify(userDetail));

    for (let i = 0; i < userDetailJson.requestRaised.length; i++) {
      if (
        userDetailJson.requestRaised[i].requestId == approvalRequest.requestId
      ) {
        userDetailJson.requestRaised[i].takePatientAprroval = true;
        userDetailJson.requestRaised[i].requestStage[3].currentStatus = "Requested"
        userDetailJson.requestRaised[i].currentStatus = "Patient Approval"
        break;
      }
    }
    console.log("Take approval:", userDetailJson.requestRaised[0].requestStage[3]);
    await this.patientModel.findOneAndUpdate(
      { userId: approvalRequest.patientId },
      userDetailJson,
    );
    return new ApiResponse(ApiResponseStatus.Success, {
      message: 'request sent',
    });
  }

  async informDonor(request: InformDonorDto): Promise<ApiResponse<any>> {
    const userDetail = await this.patientModel
      .findOne({ userId: request.patientId })
      .exec();

    const donorDetail = await this.patientModel
      .findOne({ userId: request.donorId })
      .exec();

    let userDetailJson = JSON.parse(JSON.stringify(userDetail));
    let donorDetailJson = JSON.parse(JSON.stringify(donorDetail));

    let organRequest;
    for (let i = 0; i < userDetailJson.requestRaised.length; i++) {
      if (userDetailJson.requestRaised[i].requestId == request.requestId) {
        organRequest = userDetailJson.requestRaised[i].requestDetails.organRequired
        userDetailJson.requestRaised[i].requestStage[4].currentStatus = "Informed"
        userDetailJson.requestRaised[i].currentStatus = "Donor Informed"
        break;
      }
    }

    let message = `Exciting news! A ${organRequest} recipient has been found, thanks to your generous offer. Your act of kindness is a beacon of hope that's about to transform a life. Please visit your hospital to learn more about the next steps for this incredible organ donation. Your selfless commitment is deeply appreciated, as you've played a pivotal role in saving a life. Our sincere gratitude for your exceptional service – you are making a world of difference. 😊🙏`

    let data = {
      requestId: request.requestId,
      message,
      read: false
    }

    if (donorDetailJson.notificationList == null || donorDetailJson.notificationList == undefined) {
      donorDetailJson.notificationList = [data]
    } else {
      donorDetailJson.notificationList.push(data)
    }

    await this.patientModel.findOneAndUpdate(
      { userId: request.patientId },
      userDetailJson,
    );

    await this.patientModel.findOneAndUpdate(
      { userId: request.donorId },
      donorDetailJson,
    );

    return new ApiResponse(ApiResponseStatus.Success, {
      message: 'request sent',
    });
  }
}
