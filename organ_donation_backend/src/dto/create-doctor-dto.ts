export class CreateDoctorDto {
    readonly userId: string;
    readonly hospitalId: string;
    readonly hospitalName: string;
    readonly personalInfo: Object;
    readonly donorsRejected: string[];
    readonly notification: number;
  }
  