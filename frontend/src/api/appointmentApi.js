
import { data } from "react-router-dom"
import axiosInstance from "./axiosInstance"


export const FetchSlotsApi = async(page) =>{
    const response = await axiosInstance.get('/psychologist/availability/',{
        params:{page:page}
    })
    return response.data
}

export const CreateSlotsApi = async(data) =>{
    const response = await axiosInstance.post('/psychologist/availability/',data)
    return response.data
}

export const UpdateSlotApi = async(slot_id,data) =>{
    const response = await axiosInstance.patch(`/psychologist/availability/${slot_id}/`,data)
    return response.data
}

export const DeleteSlotApi = async(slot_id) =>{
    const response = await axiosInstance.delete(`/psychologist/availability/${slot_id}/`,)
    return response.data
}

export const FetchPsychologistApi = async(page) =>{
    const response = await axiosInstance.get(`/psychologit/list/?page=${page}`)
    return response.data
}

export const PsychologistDetailApi = async(psychologist_id) =>{
    const response = await axiosInstance.get(`/psychologist/details/${psychologist_id}/`)
    return  response.data
}

export const CreateRazorpayOrderApi = async(data)=>{
    const response = await axiosInstance.post('/create-order/',data)
    return response.data
}

export const BookSlotApi = async(data)=>{
    const response = await axiosInstance.post('/book-slot/',data)
    return response.data
}

export const LockSlotApi = async(slot_id) =>{
    const response = await axiosInstance.post('/lock-slot/',{slot_id})
    return response.data
}

export const PsychologistAppointmentApi = async(page,status) =>{
    const response = await axiosInstance.get(`/psychologist/appointments/`,{
        params:{page:page,status:status}
    }
    )
    return response.data
}

export const UserAppointmentsApi = async(page,status) =>{
    const response = await axiosInstance.get('/user/appointments/?page=${page}',{
        params:{page:page,status:status}
    })
    return response.data
}

export const AdminAppointmentsApi = async(page,status) =>{
    const response = await axiosInstance.get('/admin/appointments/',{
        params:{page:page,status:status}
    })
    return response.data
}

export const UserAppointmentDetailsApi = async(appointment_id) =>{
    const response = await axiosInstance.get(`/user/appointment/details/${appointment_id}`)
    return response.data
}

export const PsychologistAppointmentDetailsApi = async(appointment_id) =>{
    const response = await axiosInstance.get(`/psychologist/appointments/details/${appointment_id}/`)
    return response.data
}

export const CancelUserAppointmentApi = async(appointment_id,data) =>{
    const response = await axiosInstance.patch(`/user/appointment/details/${appointment_id}/`,data)
    return response.data
}
export const CancelPsychologistAppointmentApi = async(appointment_id,data) =>{
    const response = await axiosInstance.patch(`/psychologist/appointments/details/${appointment_id}/`,{...data,action:'cancel'})
    return response.data
}

export const CompleteAppointmentApi = async(appointment_id,data) =>{
    const response = await axiosInstance.patch(`/psychologist/appointments/details/${appointment_id}/`,{...data,action:'complete'})
    return response.data
}