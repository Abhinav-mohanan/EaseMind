import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArticlesListApi } from '../../api/articlesApi';
import ErrorHandler from '../../Components/Layouts/ErrorHandler';
import Loading from '../../Components/Layouts/Loading';
import Navbar from '../../Components/Users/Navbar';
import { BookOpen, Calendar, User, Search, XCircle } from 'lucide-react';
import Pagination from '../../Components/Layouts/Pagination';
import Footer from '../../Components/Users/Footer';

const PublishedArticles = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [articles, setArticles] = useState([]);
    const [searchTerm,setSearchTerm] = useState('')
    const [inputValue,setInputValue] = useState('')
    const page_size = 6;

    const fetchArticles = async (page,searchTerm) => {
        try {
            setIsLoading(true);
            const data = await ArticlesListApi(page,searchTerm);
            setArticles(data.results);
            setTotalPages(Math.ceil(data.count / page_size));
        } catch (error) {
            ErrorHandler(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles(currentPage,searchTerm);
    }, [currentPage,searchTerm]);

    const handlePageChange = (pageNum) => {
        if (pageNum > 0 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        }
    };

    const handleSearchSubmit = (e) =>{
        e.preventDefault()
        setSearchTerm(inputValue.trim())
        setCurrentPage(1)
    }

    const handleClearSearch = (e) =>{
        setInputValue('')
        setSearchTerm('')
        setCurrentPage(1)
    }

    return (
        <Loading isLoading={isLoading}>
            <div className="flex flex-col min-h-screen bg-gray-100">
                <Navbar />
                <div className="flex-1 p-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                            <h2 className="text-3xl font-bold text-gray-900">Published Articles</h2>
                            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:flex-none sm:w-64">
                                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e)=>setInputValue(e.target.value)}
                                        placeholder="Search articles..."
                                        className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    />
                                {inputValue &&(
                                    <button
                                    onClick={handleClearSearch}
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                    <XCircle className="w-5 h-5" />
                                    </button>
                                )}
                                </div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 flex items-center space-x-2"
                                >
                                    <Search className="w-4 h-4" />
                                    <span>Search</span>
                                </button>
                            </form>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.length > 0 ? (
                                articles.map((article) => (
                                    <Link
                                        to={`/article/detail/${article.id}`}
                                        key={article.id}
                                        className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="p-5">
                                            {/* Article Thumbnail */}
                                            <div className="mb-4">
                                                <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                                                    {article.cover_image ? (
                                                        <img
                                                            src={article.cover_image}
                                                            alt={article.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                                                            <BookOpen className="w-10 h-10 text-teal-600" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Category Badge */}
                                            <div className="mb-2">
                                                <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-teal-700 bg-teal-100 rounded-full uppercase tracking-wide">
                                                    {article.category || 'General'}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight hover:text-teal-600 transition-colors">
                                                {article.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                                                {article.content.length > 100
                                                    ? `${article.content.substring(0, 100)}...`
                                                    : article.content}
                                            </p>

                                            {/* Meta Information */}
                                            <div className="flex items-center text-xs text-gray-500 space-x-4 mb-4">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <User className="w-4 h-4" />
                                                    <span>{article.author_name || 'Author'}</span>
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <span
                                                className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${
                                                    article.status === 'published'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                            >
                                                {article.status}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg">
                                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600 text-lg">No published articles available.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                )}
                <Footer />
            </div>
        </Loading>
    );
};

export default PublishedArticles;