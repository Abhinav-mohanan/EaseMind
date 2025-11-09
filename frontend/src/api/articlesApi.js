import axiosInstance from "./axiosInstance"

export const PsyArticleFetch = async (page,search,status) =>{
const response = await axiosInstance.get(`/articles/create/`,
    {params:{page:page,search:search,status:status}})
    return response.data
}

export const CreateArticleApi = async (data) =>{
    const response = await axiosInstance.post('/articles/create/',data,{
        headers:{'Content-Type':'multipart/form-data'}
    })
    return response.data
}

export const UpdateArticleApi = async (article_id,data) =>{
    const response = await axiosInstance.put(`/articles/create/${article_id}/`,data,{
        headers:{'Content-Type':'multipart/form-data'}
    })
    return response.data
}

export const PsyDeleteArticleApi = async (article_id) =>{
    const response = await axiosInstance.delete(`/articles/create/${article_id}/`)
    response.data
}

// list all the published articles
export const ArticlesListApi = async(page,search) =>{
    const response = await axiosInstance.get(`/articles/`,
        {params:{page:page,search:search}}
    )
    return response.data
}
export const TopArticles = async() =>{
    const response = await axiosInstance.get(`/top-articles/`)
    return response.data
}

//Article Details
export const ArticleDetailsApi = async(article_id) =>{
    const response = await axiosInstance.get(`/articles/${article_id}/`)
    return response.data
}