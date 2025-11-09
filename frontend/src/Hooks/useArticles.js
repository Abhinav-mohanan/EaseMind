import  { useEffect, useState } from 'react'
import { TopArticles } from '../api/articlesApi'

export const useArticles = () => {
  const [articles,setArticles] = useState([])
  useEffect(()=>{
    const getArticles = async () =>{
        const data =  await TopArticles()
        setArticles(data)
    }
    getArticles()
},[])

return articles
}
