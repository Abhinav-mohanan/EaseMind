import axiosInstance from "./axiosInstance"

export const GetUserHealthTrackerApi = async() =>{
    const response = await axiosInstance.get('user/health-tracking/')
    return response.data
}
export const CreateUserHealthTrackerApi = async(data) =>{
    const response = await axiosInstance.post('user/health-tracking/',data)
    return response.data
}
export const UpdateUserHealthTrackerApi = async(health_tracking_id,data) =>{
    const response = await axiosInstance.patch(`user/health-tracking/${health_tracking_id}/`,data)
    return response.data
}
export const GetUserHealthTrackerDetailsApi = async(health_tracking_id) =>{
    const response = await axiosInstance.get(`user/health-tracking/${health_tracking_id}/`)
    return response.data
}
