const DOCTOR_BASE_URL = 'http://localhost:3008/doctor'

export const DOCTOR_CONSTANT = {

  HOME_NAVIGATE_URL: "/doctor/home",

  LOGIN_NAVIGATE_URL: "/login",

  REGISTER_PAGE_URL: "/doctor/register",

  GET_DONOR_INFO: `${DOCTOR_BASE_URL}/donor-details?`,

  SAVE_DOCTOR_PERSONAL_INFO: `${DOCTOR_BASE_URL}/save/personal-detail`,

  GET_DOCTOR_PERSONAL_INFO: `${DOCTOR_BASE_URL}/personal-detail?id`,

  GET_DONOR_LIST: `${DOCTOR_BASE_URL}/donor-list?hospitalId`,

  GET_PATIENT_ORGAN_REQUEST_LIST: `${DOCTOR_BASE_URL}/organ-receiver-list?userId`,

  GET_PATIENT_ORGAN_REQUEST_DETAIL: `${DOCTOR_BASE_URL}/organ-request-detail?`,

  GIVE_DOCTOR_APPROVAL: `${DOCTOR_BASE_URL}/approval`,
  
}