import mongoose, { Document, Schema } from 'mongoose';

interface RequestDetails {
    requestId: string;
    doctorId: string;
    bloodGroup: string;
    doctorName: string;
    organRequest: string;
    priority: string;
    donorId: string;
    creationDate: string;
    bmi: string;
    organId: string;
    createdBy: string;
    patientId: string;
}

interface RequestStage {
    id: number;
    currentStage: string;
    currentStatus: string;
}

interface RequestRaised {
    requestDetails: RequestDetails;
    requestStage: RequestStage[];
    takeAprroval: boolean;
    organProcedureStatus: {
        removed: {},
        transport: {},
        received: {},
        transplant: {}
    };
}

interface User extends Document {
    userId: string;
    userType: string;
    organ: string[];
    personalInfo: {};
    medicalInfo: {};
    donarsRejected: string[];
    requestRaised: RequestRaised[];
    notification: number;
}

const UserSchema: Schema = new Schema({
    userId: { type: String, required: true },
    userType: { type: String, required: true },
    organ: { type: [String], required: true },
    personalInfo: { type: Object, required: true },
    medicalInfo: { type: Object, required: true },
    donarsRejected: { type: [String], required: true },
    requestRaised: [{
        requestDetails: {
            requestId: String,
            doctorId: String,
            bloodGroup: String,
            doctorName: String,
            organRequest: String,
            priority: String,
            donorId: String,
            creationDate: String,
            bmi: String,
            organId: String,
            createdBy: String,
            patientId: String
        },
        requestStage: [{
            id: Number,
            currentStage: String,
            currentStatus: String
        }],
        takeAprroval: Boolean,
        organProcedureStatus: {
            removed: Object,
            transport: Object,
            received: Object,
            transplant: Object
        }
    }],
    notification: { type: Number, required: true }
});

export default mongoose.model<User>('User', UserSchema);
