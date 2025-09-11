import axiosInstance from "./axiosInstance"

export const PsychologistCompletedAppointmentsListApi = async() =>{
    const response = await axiosInstance.get('/psychologist/consultations/')
    return response.data
}

export const UserCompletedAppointmentsListApi = async() =>{
    const response = await axiosInstance.get('user/consultations/')
    return response.data
}

export const GetPsychologistPrescriptionApi = async(appointment_id) =>{
    const response = await axiosInstance.get(`/psychologist/prescription/${appointment_id}/`)
    return response.data
}
export const CreatePsychologistPrescriptionApi = async(appointment_id,data) =>{
    const response = await axiosInstance.post(`/psychologist/prescription/${appointment_id}/`,data)
    return response.data
}
export const UpdatePsychologistPrescriptionApi = async(appointment_id,data) =>{
    const response = await axiosInstance.patch(`/psychologist/prescription/${appointment_id}/`,data)
    return response.data
}
export const GetUserPrescriptionApi = async(appointment_id) =>{
    const response = await axiosInstance.get(`/user/prescription/${appointment_id}/`)
    return response.data
}