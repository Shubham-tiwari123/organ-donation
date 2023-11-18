export class UpdatePatientDto {
  readonly userId?: string;
  readonly userType?: string;
  readonly organ?: string[];
  readonly personalInfo?: Object;
  readonly medicalInfo?: Object;
  readonly donorsRejected?: string[];
  readonly requestRaised?: Object[];
  readonly notification?: number;
}
