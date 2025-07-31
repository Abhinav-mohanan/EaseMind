
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
