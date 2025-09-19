import axiosInstance from "./axiosInstance"

export const AdminDashboardApi = async() =>{
    const response = await axiosInstance('/admin/dashboard/')
    return response.data
}