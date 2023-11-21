const HOSPITAL_BASE_URL = 'http://localhost:3008/hospital'

const PATIENT_BASE_URL = 'http://localhost:3008/patient'

const ORGAN_BASE_URL = 'http://localhost:3008/organ'

const IOT_BASE_URL = 'http://localhost:3008/iot'

export const HOSPITAL_CONSTANT = {

    TEMPRATURE_THRESHOLD_MAX: 30,

    TEMPRATURE_THRESHOLD_MIN: 10,

    VIBRATION_THRESHOLD_MAX: 50,

    VIBRATION_THRESHOLD_MIN: 20,

    HUMIDITY_THRESHOLD_MAX: 30,

    HUMIDITY_THRESHOLD_MIN: 10,

    ORIENTATION_THRESHOLD_MAX: 60,

    ORIENTATION_THRESHOLD_MIN: 30,

    INTENSITY_THRESHOLD_MAX: 80,

    INTENSITY_THRESHOLD_MIN: 40,

    HOSPITAL_REACT_BASE_URL: '/hospital',

    LOGIN_NAVIGATE_URL: "/hospital/patient",

    HOSPITAL_LOGIN_PAGE: "/login",

    UPDATE_PATIENTID_IOTBOX: `${IOT_BASE_URL}/update-iot-box?patientId`,

    FREE_IOTBOX: `${IOT_BASE_URL}/free-iotbox?patientId`,

    FREE_IOTBOX_STATUS: `${IOT_BASE_URL}/update-iotbox-status?patientId`,

    GET_PATIENT_LIST_API: `${HOSPITAL_BASE_URL}/patientList?hospitalId`,

    GET_PATIENT_DETAIL_API: `${HOSPITAL_BASE_URL}/patient?patientId`,

    GET_DOCTOR_PATIENT_LIST: `${HOSPITAL_BASE_URL}/patient-doctor/list?hospitalId`,

    GET_PATIENTS_API: `${PATIENT_BASE_URL}/allPatients`,

    GET_REQUEST_DETAILS_API: `${HOSPITAL_BASE_URL}/waiting/details?`,

    GET_WAITING_LIST_API: `${HOSPITAL_BASE_URL}/waitingList?hospitalId`,

    GET_IOT_PATIENT_LIST: `${HOSPITAL_BASE_URL}/iot/patientList?hospitalId`,

    GET_DOCTOR_LIST_API: `${HOSPITAL_BASE_URL}/doctorList?hospitalId`,

    GET_DOCTOR_PROFILE_DETAILS: `${HOSPITAL_BASE_URL}/doctor?doctorId`,

    GET_TRANSPLANT_DETAILS: `${ORGAN_BASE_URL}/organ-details?requestId`,

    UPDATE_DONOR_DETAIL_API: `${HOSPITAL_BASE_URL}/update/medical-record`,

    SAVE_NEW_REQUEST_API: `${HOSPITAL_BASE_URL}/create/new-request`,

    SAVE_MEDICAL_RECORD: `${HOSPITAL_BASE_URL}/create/medical-record`,

    SAVE_ORGAN_TRANSPLANT_API: `${ORGAN_BASE_URL}/save/organ-transplant`,

    SAVE_ORGAN_TRANSPORT_API: `${ORGAN_BASE_URL}/save/organ-transport`,

    SAVE_ORGAN_REMOVED_API: `${ORGAN_BASE_URL}/save/organ-removed`,

    SAVE_ORGAN_RECEIVED_API: `${ORGAN_BASE_URL}/save/organ-received`,

    FIND_MATCH_API: `${HOSPITAL_BASE_URL}/request/find-match`,

    CONFIRM_MATCH: `${HOSPITAL_BASE_URL}/request/change-organ-status`,

    TAKE_DOCTOR_APPROVAL_API: `${HOSPITAL_BASE_URL}/request/doctor-approval`,

    TAKE_PATIENT_CONSENT_API: `${HOSPITAL_BASE_URL}/request/patient-consent`,

    INFORM_DONOR_API: `${HOSPITAL_BASE_URL}/request/inform-donor`
}