import axiosInstance from "./axiosInstance"

export const GetZegoTokenApi = async(appointment_id) =>{
    const response = await axiosInstance.get(`get-zego-token/${appointment_id}/`)
    return response.data
}
