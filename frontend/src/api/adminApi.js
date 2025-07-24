import axiosInstance from "./axiosInstance"

// Admin login
export const AdminLoginApi = async(data) =>{
    const response = await axiosInstance.post('/admin/login/',data)
    return response.data
}

// Get user Details
export const AdminUserDetailApi = async(page) =>{
    const response = await axiosInstance.get(`/admin/user/details/?page=${page}`)
    return response.data
}

// Manage users
export const ManageUserApi = async(user_id,current_status) => {
    const response = await axiosInstance.patch(`/admin/user/manage/${user_id}/`,
        {'is_active':!current_status})
    return response.data
}

