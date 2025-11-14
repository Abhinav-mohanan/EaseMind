import React, { useEffect, useState } from 'react';
import { AdminArticleDeleteApi, AdminArticlesApi } from '../../api/adminApi';
import ErrorHandler from '../../Components/Layouts/ErrorHandler';
import { toast } from 'react-toastify';
import Loading from '../../Components/Layouts/Loading';
import AdminSidebar from '../../Components/Admin/AdminSidebar';
import AdminHeader from '../../Components/Admin/AdminHeader';
import { Eye, ImageIcon, Trash2, XCircle, Search, Plus } from 'lucide-react';
import Pagination from '../../Components/Layouts/Pagination';
import ConfirmationModal from '../../Components/Layouts/Confirmationmodal';
import { useNavigate } from 'react-router-dom';

const ArticlesManage = () => {
    const navigate = useNavigate()
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [previewArticle, setPreviewArticle] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const page_size = 6;

    useEffect(() => {
        fetchArticles(currentPage);
    }, [currentPage, searchTerm]);

    const fetchArticles = async (page, term = searchTerm) => {
        try {
            setIsLoading(true);
            const data = await AdminArticlesApi(page, term);
            setArticles(data.results);
            setTotalPages(Math.ceil(data.count / page_size));
        } catch (error) {
            ErrorHandler(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteArticle = (article_id) => {
        setArticleToDelete(article_id);
        setIsModalOpen(true);
    };

    const confirmDeleteArticle = async () => {
        if (!articleToDelete) return;
        try {
            const data = await AdminArticleDeleteApi(articleToDelete);
            toast.success(data.message);
            fetchArticles(currentPage);
        } catch (error) {
            ErrorHandler(error);
        } finally {
            setIsLoading(true);
        }
    };

    const onCloseModal = () => {
        setIsModalOpen(false);
        setArticleToDelete(null);
    };

    const handleViewArticle = (article) => {
        setPreviewArticle(article);
    };

    const closePreview = () => {
        setPreviewArticle(null);
    };

    const handlePageChange = (pageNum) => {
        if (pageNum > 0 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(inputValue.trim());
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setInputValue('');
        setCurrentPage(1);
    };

    return (
        <Loading isLoading={isLoading}>
            <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <AdminSidebar />
                <div className="flex-1 ml-64 bg-gray-50">
                    <AdminHeader />
                    <div className="p-6">
                        <div className="max-w-7xl mx-auto">
                            {/* Header Section */}
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 mb-8 overflow-hidden">
                                <div className="bg-gradient-to-r from-teal-600 via-teal-600 to-teal-800 px-8 py-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold text-white mb-1">Articles Dashboard</h1>
                                            <p className="text-teal-100">Manage and monitor published articles</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Search Section */}
                                <div className="px-8 py-6 border-b border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full max-w-md">
                                            <div className="relative flex-1">
                                                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={inputValue}
                                                    onChange={(e) => setInputValue(e.target.value)}
                                                    placeholder="Search by title or content..."
                                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 pl-10 pr-10"
                                                />
                                                {inputValue&&(
                                                    <button
                                                    type="button"
                                                    onClick={handleClearSearch}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                                )}
                                            </div>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-800 text-white font-medium rounded-lg hover:from-teal-700 
                                                hover:to-teal-900 transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2"
                                            >
                                                <Search className="w-4 h-4" />
                                                <span>Search</span>
                                            </button>
                                        </form>
                                        <div className="text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-lg">
                                            <span className="font-medium">{articles.length}</span> articles
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-end mb-2'>
                                <button
                                onClick={()=>navigate('/admin/categories/create')}
                                 className='inline-flex items-center px-5 py-2 bg-gradient-to-r from-teal-600 to-teal-800 text-white font-medium rounded-lg 
                                hover:from-teal-700 hover:to-teal-900 transition-all duration-200 shadow-sm'>
                                    <Plus/>
                                    Create New Category
                                </button>
                            </div>

                            {/* Articles Section */}
                            {articles.length > 0 ? (
                                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700">Title</th>
                                                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700">Author</th>
                                                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-700">Category</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Content Preview</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Created</th>
                                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {articles.map((article) => (
                                                    <tr key={article.id} className="hover:bg-slate-50 transition-colors duration-150">
                                                        <td className="px-8 py-6">
                                                            <h3 className="font-semibold text-slate-900">{article.title}</h3>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <h3 className="font-semibold text-slate-900">{article.author_name}</h3>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <h3 className="font-semibold text-slate-900">{article.category}</h3>
                                                        </td>
                                                        <td className="px-6 py-6">
                                                            <p className="text-sm text-slate-600 line-clamp-2">{article.content}</p>
                                                        </td>
                                                        <td className="px-6 py-6">
                                                            <span className="text-sm text-slate-600">{new Date(article.created_at).toLocaleDateString()}</span>
                                                        </td>
                                                        <td className="px-6 py-6">
                                                            <button
                                                                onClick={() => handleViewArticle(article)}
                                                                className="inline-flex items-center px-4 py-2 m-2 bg-gradient-to-r from-teal-600 to-teal-800 text-white text-sm font-medium 
                                                                rounded-lg hover:from-teal-800 hover:to-teal-900 transition-all duration-200 shadow-sm hover:shadow-md mr-2"
                                                            >
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteArticle(article.id)}
                                                                className="inline-flex items-center px-4 py-2 m-2 bg-gradient-to-r from-red-700 to-red-800 text-white text-sm font-medium 
                                                                rounded-lg hover:from-red-800 hover:to-red-900 transition-all duration-200 shadow-sm hover:shadow-md"
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-12 text-center">
                                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                                        <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No articles found</h3>
                                    <p className="text-slate-500">No published articles match your search criteria.</p>
                                </div>
                            )}
                            {totalPages > 1 && (
                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                            )}
                        </div>
                    </div>
                </div>

                {previewArticle && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">{previewArticle.title}</h2>
                            <div className="mb-4">
                                {previewArticle.cover_image ? (
                                    <img
                                        src={previewArticle.cover_image}
                                        alt={previewArticle.title}
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-64 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center">
                                        <ImageIcon className="w-20 h-20 text-slate-500" />
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-slate-600 mb-4">{previewArticle.content}</p>
                            <p className="text-sm text-slate-500">Created: {new Date(previewArticle.created_at).toLocaleDateString()}</p>
                            <button
                                onClick={closePreview}
                                className="mt-4 px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-800 text-white font-medium rounded-lg hover:from-teal-700 
                                hover:to-teal-900 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={onCloseModal}
                onConfirm={confirmDeleteArticle}
                title="Delete Article"
                message="Are you sure you want to delete this article? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />
        </Loading>
    );
};

export default ArticlesManage;