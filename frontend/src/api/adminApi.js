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
        {'is_blocked':!current_status})
    return response.data
}

export const AdminPsychologistDetailApi = async(page) =>{
    const response = await axiosInstance.get(`/admin/psychologist/details/?page=${page}`)
    return response.data
}

export const ManagePsychologistApi = async(psychologist_id,current_status) =>{
    const response = await axiosInstance.patch(`/admin/psychologist/manage/${psychologist_id}/`,
        {'is_blocked':!current_status})
    return response.data
}

export const PsychologistVerificationDetailsApi = async(page,status) =>{
    const response = await axiosInstance.get('/admin/psychologist/verification/details/',
        {params:{status,page}}
    )
    return response.data
}

export const HandlePsychologistVerificationApi = async(psychologist_id,action) =>{
    const response = await axiosInstance.patch(`/admin/psychologist/verification/${psychologist_id}/`,
        {action}
    )
    return response.data
}