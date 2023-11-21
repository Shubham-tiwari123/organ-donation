const BASE_URL = 'http://localhost:3008'

export const CommonConstant = {

    PATIENT_HOME_PAGE: "/patient/home",

    DOCTOR_HOME_PAGE: "/doctor/home",

    HOSPITAL_HOME_PAGE: "/hospital/patient",

    REGISTER_PAGE: "/register",

    CHECK_LOGIN_CREDENTIALS: `${BASE_URL}/login?address`,

    SAVE_REGISTER_DETAILS: `${BASE_URL}/register`,

    REGISTER_HOSPITAL: `${BASE_URL}/admin/register/hospital`,
}