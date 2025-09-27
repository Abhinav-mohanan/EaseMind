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

export const HandlePsychologistVerificationApi = async(psychologist_id,action,rejection_reason = '') =>{
    const response = await axiosInstance.patch(`/admin/psychologist/verification/${psychologist_id}/`,
        {action,...(action === 'reject' && {rejection_reason})}
    )
    return response.data
}

export const AdminArticlesApi = async(page,search) =>{
    const response = await axiosInstance.get(`/admin/articles/`,
        {params:{page:page,search:search}}
    )
    return response.data
}

export const AdminArticleDeleteApi = async(article_id) =>{
    const response = await axiosInstance.delete(`/admin/article/${article_id}/`)
    return response.data
}