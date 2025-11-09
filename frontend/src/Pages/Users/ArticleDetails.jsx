import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArticleDetailsApi } from '../../api/articlesApi'
import ErrorHandler from '../../Components/Layouts/ErrorHandler'
import Loading from '../../Components/Layouts/Loading';
import Navbar from '../../Components/Users/Common/Navbar';
import { BookOpen, Calendar, ImageIcon, User } from 'lucide-react';
import Footer from '../../Components/Users/Common/Footer';

const ArticleDetails = () => {
    const {article_id} = useParams() 
    const navigate = useNavigate()
    const [isLoading,setIsLoading] = useState(false)
    const [article,setArticles] = useState(null)

    const fetchArticles = async() =>{
        try{
            setIsLoading(true)
            const data = await ArticleDetailsApi(article_id)
            setArticles(data)
        }catch(error){
            ErrorHandler(error)
        }finally{
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        fetchArticles()
    },[])

    const defaultImage = (
        <div className="w-full h-72 bg-gray-200 flex items-center justify-center rounded-lg mb-6">
            <ImageIcon className="w-24 h-24 text-gray-400" />
        </div>
    );

    return (
        <Loading isLoading={isLoading}>
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white pt-16">
                <Navbar />
                <div className="flex-1 p-6 md:p-12">
                    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8 border border-gray-100">
                        <button
                            onClick={() => navigate('/articles')}
                            className="mb-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                        >
                            Back to Articles
                        </button>

                        {article ? (
                            <>
                                <h1 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                                    {article.title}
                                </h1>

                                {/* Metadata */}
                                <div className="flex items-center text-sm text-gray-600 mb-8 space-x-6">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-5 h-5 text-blue-500" />
                                        <span>{new Date(article.created_at).toLocaleDateString('en-Asia', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <User className="w-5 h-5 text-blue-500" />
                                        <span>{article.author_name || 'Author'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <BookOpen className="w-5 h-5 text-blue-500" />
                                        <span>{article.total_readers || '0'}</span>
                                    </div>
                                </div>

                                {/* Cover Image */}
                                {article.cover_image ? (
                                    <img
                                        src={article.cover_image}
                                        alt={article.title}
                                        className="w-full h-80 object-cover rounded-xl mb-8 shadow-md"
                                    />
                                ) : (
                                    defaultImage
                                )}

                                {/* Content */}
                                <div className="prose prose-lg text-gray-800 max-w-none">
                                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                                </div>
                            </>
                        ) : (
                            <p className="text-center text-gray-500 text-xl">Article not found.</p>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </Loading>
    );
};

export default ArticleDetails