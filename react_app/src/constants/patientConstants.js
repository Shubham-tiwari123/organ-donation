const PATIENT_BASE_URL = 'http://localhost:3008/patient'

const ORGAN_BASE_URL = 'http://localhost:3008/organ'

export const PATIENT_CONSTANT = {

    HOME_NAVIGATE_URL: "/patient/home",

    LOGIN_NAVIGATE_URL: "/login",
    
    SAVE_PATIENT_PERSONAL_INFO: `${PATIENT_BASE_URL}/save/personal-detail`,

    GET_PATIENT_PERSONAL_INFO: `${PATIENT_BASE_URL}/personal-detail?id`,

    GET_PATIENT_MEDICAL_INFO: `${PATIENT_BASE_URL}/medical-detials?patientId`,

    GET_PATIENT_ORGAN_REQUEST_LIST: `${PATIENT_BASE_URL}/organ-list?patientId`,

    GET_PATIENT_ORGAN_REQUEST_DETAIL: `${PATIENT_BASE_URL}/organ-detail?`,

    GIVE_APPROVAL: `${PATIENT_BASE_URL}/consent?`,

    GET_TRANSPLANT_DETAILS: `${ORGAN_BASE_URL}/organ-details?requestId`,

    GET_NOTIFICATION: `${PATIENT_BASE_URL}/notification?patientId`,

}