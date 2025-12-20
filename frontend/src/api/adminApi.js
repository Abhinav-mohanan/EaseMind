import axiosInstance from "./axiosInstance"

export const AdminLoginApi = async(data) =>{
    const response = await axiosInstance.post('/admin/login/',data)
    return response.data
}

export const AdminUserDetailApi = async(page,status) =>{
    const response = await axiosInstance.get(`/admin/user/details/`,{
        params:{page,status}
    })
    return response.data
}

export const ManageUserApi = async(user_id,current_status) => {
    const response = await axiosInstance.patch(`/admin/user/manage/${user_id}/`,
        {'is_blocked':!current_status})
    return response.data
}

export const AdminPsychologistDetailApi = async(page,status) =>{
    const response = await axiosInstance.get(`/admin/psychologist/details/`,{
        params:{page,status}
    })
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

export const FetchPayoutApi = async(status,page) =>{
    const response = await axiosInstance.get('/admin/payouts/',{
        params:{status:status,page:page}
    })
    return response.data
}

export const handlePayoutApi = async(payout_id,data) =>{
    const response = await axiosInstance.post(`/admin/payouts/${payout_id}/`,data)
    return response.data
}

export const fetchRevenueDetails = async(page) =>{
    const response = await axiosInstance.get('admin/revenue-details/',{
        params:{page:page}}
    )
    return response.data
}