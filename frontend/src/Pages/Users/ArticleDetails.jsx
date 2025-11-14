import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArticleDetailsApi } from '../../api/articlesApi'
import ErrorHandler from '../../Components/Layouts/ErrorHandler'
import Loading from '../../Components/Layouts/Loading';
import Navbar from '../../Components/Users/Common/Navbar';
import { BookOpen, Calendar, ImageIcon, User } from 'lucide-react';
import Footer from '../../Components/Users/Common/Footer';
import ArticleHero from '../../Components/Users/Common/ArticleHero';
import ArticleContent from '../../Components/Users/Common/ArticleContent';
import EngagementAuthor from '../../Components/Users/Common/EngagementAuthor';
import CommentsSection from '../../Components/Users/Common/CommentsSection';
import Breadcrumbs from '../../Components/Layouts/Breadcrumbs';
import FormatDate from '../../Components/Layouts/FormatDate';

const ArticleDetails = () => {
    const {article_id} = useParams() 
    const [isLoading,setIsLoading] = useState(false)
    const [article,setArticles] = useState(null)

    const fetchArticles = async() =>{
        try{
            setIsLoading(true)
            const data = await ArticleDetailsApi(article_id)
            setArticles(data)
            console.log('article',data)
        }catch(error){
            ErrorHandler(error)
        }finally{
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        fetchArticles()
    },[])

     const breadcrumbItems = [
        {label:'Articles',link:'/articles'},
        {label:'Detail',link:null}
    ]

    const defaultImage = (
        <div className="w-full h-72 bg-gray-200 flex items-center justify-center rounded-lg mb-6">
            <ImageIcon className="w-24 h-24 text-gray-400" />
        </div>
    );

    const articleData = {...article};


    return (
       <>
       <Navbar/>
        <div className="relative flex h-auto min-h-screen w-full flex-col p-16 bg-[#F8F9FA] font-['Inter',sans-serif] text-[#343A40]">
      <main className="flex flex-1 justify-center py-5 sm:py-10">
        <div className="flex flex-col w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems}/>
          <ArticleHero
            imageUrl={articleData.cover_image}
            title={articleData.title}
            author={articleData.author_name}
            date={articleData.created_at}
            defaultImage={defaultImage}
            formatDate={FormatDate}
          />
          
          <ArticleContent content={articleData.content}/>
          {article &&(
            
            <EngagementAuthor 
            likes={articleData.likes}
            views={articleData.total_readers}
            author={articleData.authorDetails}
            is_liked={articleData.is_liked}
            article={articleData}
            />
          )}
          
          <CommentsSection />
        </div>
      </main>
    </div>
    <Footer/>
    </>
  );
}
export default ArticleDetails