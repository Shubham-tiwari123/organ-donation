export class AddPatientDetailsDto {
  readonly userId: string;
  readonly userType: string;
  readonly organ: Object[];
  readonly personalInfo: Object;
  // readonly hospitalId: string;
  // readonly medicalInfo: Object;
  // readonly donorsRejected: string[];
  // readonly requestRaised: Object[];
  // readonly notification: number;
}
