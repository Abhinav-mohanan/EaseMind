import axiosInstance from "./axiosInstance"

export const PsyArticleFetch = async (page) =>{
const response = await axiosInstance.get(`/articles/create/?page=${page}`)
    return response.data
}

export const CreateArticleApi = async (data) =>{
    const response = await axiosInstance.post('/articles/create/',data,{
        headers:{'Content-Type':'multipart/form-data'}
    })
    return response.data
}

export const UpdateArticleApi = async (article_id,data) =>{
    const response = await axiosInstance.put(`/articles/${article_id}/`,data,{
        headers:{'Content-Type':'multipart/form-data'}
    })
    return response.data
}

export const PsyDeleteArticleApi = async (article_id) =>{
    const response = await axiosInstance.delete(`/articles/${article_id}/`)
    response.data
}