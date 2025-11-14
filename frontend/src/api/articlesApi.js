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
export const ArticlesListApi = async(page,search,category,author,sort) =>{
    const response = await axiosInstance.get(`/articles/`,
        {params:{page:page,search:search,author:author,category:category,sort:sort}}
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

export const CategoryFetch = async(page) =>{
    const response = await axiosInstance.get(`/admin/create/category/?page=${page}`)
    return response.data

}

export const CreateCategory = async(data) =>{
    const response = await axiosInstance.post('/admin/create/category/',data)
    return response.data

}

export const UpdateCategory = async(category_id,data) =>{
    const response = await axiosInstance.put(`/admin/create/category/${category_id}/`,data)
    return response.data

}

export const DeleteCategory = async(category_id) =>{
    const response = await axiosInstance.delete(`/admin/create/category/${category_id}/`)
    return response.data

}

export const FetchAllCategory = async() =>{
    const response = await axiosInstance.get('/categories/')
    return response.data

}

export const ToggleLikeApi = async (article_id) => {
  const response = await axiosInstance.post(`/articles/${article_id}/like/`)
  return response.data;
};

export const GetCommentsApi = async (articleId,page) => {
  const response = await axiosInstance.get(`/articles/${articleId}/comments/`,
    {params:{page:page}}
  );
  return response.data;
};

export const PostCommentApi = async (articleId, comment) => {
  const response = await axiosInstance.post(`/articles/${articleId}/comments/`, {
    comment: comment,
  });
  return response.data;
};

export const EditCommentApi = async (commentId, comment) => {
  const response = await axiosInstance.put(`comment/detail/${commentId}/`, { comment })
  return response.data;
};

export const DeleteCommentApi = async (commentId) => {
  const response = await axiosInstance.delete(`comment/detail/${commentId}/`)
  return response.data;
};
