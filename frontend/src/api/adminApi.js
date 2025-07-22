import axiosInstance from "./axiosInstance"

// Admin login
export const AdminLoginApi = async(data) =>{
    const response = await axiosInstance.post('/admin/login/',data)
    return response.data
}

