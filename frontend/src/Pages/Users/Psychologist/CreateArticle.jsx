import React, { useEffect, useState } from 'react';
import { CreateArticleApi, PsyArticleFetch, PsyDeleteArticleApi, UpdateArticleApi } from '../../../api/articlesApi';
import ErrorHandler from '../../../Components/Layouts/ErrorHandler';
import { toast } from 'react-toastify';
import Loading from '../../../Components/Layouts/Loading';
import PsychologistSidebar from '../../../Components/Users/Psychologist/PsychologistSidebar';
import { PenSquare, Trash2, BookOpen, Eye, Save, X, Plus, Calendar, User, Image, Search, Filter, XCircle } from 'lucide-react';
import Navbar from '../../../Components/Users/Navbar';
import Pagination from '../../../Components/Layouts/Pagination';
import ConfirmationModal from '../../../Components/Layouts/Confirmationmodal';

const CreateArticle = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [articles, setArticles] = useState([]);
    const [newArticle, setNewArticle] = useState({
        title: '',
        content: '',
        category: '',
        cover_image: null,
        status: 'draft',
    });
    const [isCreating, setIsCreating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [inputValue, setInputValue] = useState('');
    const page_size = 6;

    const fetchArticles = async (page, term = searchTerm, status = filterStatus) => {
        try {
            setIsLoading(true);
            const data = await PsyArticleFetch(page, term, status);
            setArticles(data.results);
            setTotalPages(Math.ceil(data.count / page_size));
        } catch (error) {
            ErrorHandler(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles(currentPage);
    }, [currentPage, searchTerm, filterStatus]);

    const handleCreateOrUpdateArticle = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', newArticle.title);
            formData.append('content', newArticle.content);
            formData.append('category', newArticle.category);
            formData.append('status', newArticle.status);
            if (newArticle.cover_image) {
                formData.append('cover_image', newArticle.cover_image);
            }

            if (editingArticle) {
                await UpdateArticleApi(editingArticle.id, formData);
                toast.success("Updated article successfully.");
            } else {
                await CreateArticleApi(formData);
                toast.success("Created article successfully.");
            }
            setNewArticle({
                title: '',
                content: '',
                category: '',
                cover_image: null,
                status: 'draft',
            });
            setImagePreview('');
            setEditingArticle(null);
            setIsCreating(false);
            fetchArticles(currentPage);
        } catch (error) {
            ErrorHandler(error);
        }
    };

    const handleEdit = (article) => {
        setNewArticle({
            title: article.title,
            content: article.content,
            category: article.category,
            cover_image: null,
            status: article.status,
        });
        setImagePreview(article.cover_image || '');
        setEditingArticle(article);
        setIsCreating(true);
    };

    const handleDelete = (article_id) => {
        setArticleToDelete(article_id);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!articleToDelete) return;
        try {
            await PsyDeleteArticleApi(articleToDelete);
            toast.success("Article deleted successfully");
            fetchArticles(currentPage);
        } catch (error) {
            ErrorHandler(error);
        }
    }

    const onCloseModal = () => {
        setIsModalOpen(false);
        setArticleToDelete(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewArticle({ ...newArticle, cover_image: file });
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setNewArticle({ ...newArticle, cover_image: null });
            setImagePreview('');
        }
    };

    const handlePageChange = (pageNum) => {
        if (pageNum > 0 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchTerm(inputValue.trim());
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        setInputValue('');
        setSearchTerm('');
        setCurrentPage(1);
    };

    if (isCreating) {
        return (
            <Loading isLoading={isLoading}>
                <div className="min-h-screen bg-gray-50">
                    <PsychologistSidebar />
                    <div className="ml-0 lg:ml-64 transition-all duration-300">
                        <Navbar />
                        <div className="flex-1">
                            {/* Header */}
                            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <h1 className="text-2xl font-semibold text-gray-900">ARTICLE EDITOR</h1>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => setShowPreview(!showPreview)}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span>{showPreview ? 'Edit' : 'Preview'}</span>
                                        </button>
                                        <button
                                            onClick={handleCreateOrUpdateArticle}
                                            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 flex items-center space-x-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            <span>Save</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsCreating(false);
                                                setShowPreview(false);
                                                setEditingArticle(null);
                                                setNewArticle({ title: '', content: '', cover_image: null, category: '', status: 'draft' });
                                                setImagePreview('');
                                            }}
                                            className="p-2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex gap-6">
                                    {/* Main Editor */}
                                    <div className="flex-1">
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                            {!showPreview ? (
                                                <div className="p-6">
                                                    {/* Title */}
                                                    <div className="mb-6">
                                                        <input
                                                            type="text"
                                                            value={newArticle.title}
                                                            onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                                                            placeholder="Article Title"
                                                            className="w-full text-3xl font-bold text-gray-900 border-none outline-none placeholder-gray-400 bg-transparent"
                                                            required
                                                        />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="mb-6">
                                                        <textarea
                                                            value={newArticle.content}
                                                            onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                                                            placeholder="Start writing your article..."
                                                            className="w-full h-96 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-6">
                                                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                                                        {newArticle.title || 'Untitled Article'}
                                                    </h1>
                                                    {imagePreview && (
                                                        <img
                                                            src={imagePreview}
                                                            alt="Article cover"
                                                            className="w-full h-64 object-cover rounded-lg mb-6"
                                                        />
                                                    )}
                                                    <div className="prose max-w-none">
                                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                            {newArticle.content || 'No content yet...'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sidebar */}
                                    <div className="w-80">
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Settings</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                                    <input
                                                        type="text"
                                                        value={newArticle.category}
                                                        onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                                                        placeholder="Enter category"
                                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                                    <select
                                                        value={newArticle.status}
                                                        onChange={(e) => setNewArticle({ ...newArticle, status: e.target.value })}
                                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                                    >
                                                        <option value="draft">Draft</option>
                                                        <option value="published">Published</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        <Image className="w-4 h-4 inline mr-1" />
                                                        Cover Image
                                                    </label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                                    />
                                                    {imagePreview && (
                                                        <div className="mt-2">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Cover preview"
                                                                className="w-full h-32 object-cover rounded-lg"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Loading>
        );
    }

    return (
        <Loading isLoading={isLoading}>
            <div className="min-h-screen bg-gray-50">
                <PsychologistSidebar />
                <div className="ml-0 lg:ml-64 transition-all duration-300">
                    <Navbar />
                    <div className="flex-1">
                        {/* Header */}
                        <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <h1 className="text-2xl font-semibold text-gray-900">ARTICLES</h1>
                                    <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                                        {articles.length} articles
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsCreating(true);
                                        setNewArticle({ title: '', content: '', cover_image: null, category: '', status: 'draft' });
                                        setEditingArticle(null);
                                        setImagePreview('');
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 flex items-center space-x-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>New Article</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Search and Filters */}
                            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-4 mb-6">
                                <div className="flex-1 relative">
                                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Search articles..."
                                        className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    />
                                    {inputValue && (
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
                                    className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 flex items-center space-x-2"
                                >
                                    <Search className="w-4 h-4" />
                                    <span>Search</span>
                                </button>
                                <div className="flex items-center space-x-2">
                                    <Filter className="w-4 h-4 text-gray-400" />
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => {
                                            setFilterStatus(e.target.value);
                                            setCurrentPage(1);
                                            fetchArticles(1, searchTerm, e.target.value);
                                        }}
                                        className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>
                            </form>

                            {/* Articles List */}
                            {articles.length > 0 ? (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="divide-y divide-gray-100">
                                        {articles.map((article) => (
                                            <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex gap-4">
                                                    {/* Article Thumbnail */}
                                                    <div className="flex-shrink-0">
                                                        <div className="w-24 h-20 bg-gray-200 rounded-lg overflow-hidden">
                                                            {article.cover_image ? (
                                                                <img
                                                                    src={article.cover_image}
                                                                    alt={article.title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                                                                    <BookOpen className="w-8 h-8 text-teal-600" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Article Content */}
                                                    <div className="flex-1 min-w-0">
                                                        {/* Category Badge */}
                                                        <div className="mb-2">
                                                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-teal-700 bg-teal-100 rounded-md uppercase tracking-wide">
                                                                {article.category || 'General'}
                                                            </span>
                                                        </div>

                                                        {/* Title */}
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                                                            {article.title}
                                                        </h3>

                                                        {/* Description */}
                                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                                                            {article.content.length > 100
                                                                ? `${article.content.substring(0, 100)}...`
                                                                : article.content}
                                                        </p>

                                                        {/* Meta Information */}
                                                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                                                            <div className="flex items-center space-x-1">
                                                                <Calendar className="w-3 h-3" />
                                                                <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <User className="w-3 h-3" />
                                                                <span>{article.author_name || 'Author'}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex-shrink-0 flex items-center space-x-2">
                                                        <span
                                                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                article.status === 'published'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                        >
                                                            {article.status}
                                                        </span>
                                                        <button
                                                            onClick={() => handleEdit(article)}
                                                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                            title="Edit article"
                                                        >
                                                            <PenSquare className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(article.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete article"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {totalPages > 1 && (
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                onPageChange={handlePageChange}
                                            />
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {searchTerm ? 'No articles match your search' : 'No articles found'}
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        {searchTerm ? 'Try adjusting your search or filters' : 'Try creating a new article'}
                                    </p>
                                    <button
                                        onClick={() => {
                                            setIsCreating(true);
                                            setNewArticle({ title: '', content: '', cover_image: null, category: '', status: 'draft' });
                                            setImagePreview('');
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700"
                                    >
                                        Create Article
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={onCloseModal}
                    onConfirm={confirmDelete}
                    title="Delete Article"
                    message="Are you sure you want to delete this article? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            </div>
        </Loading>
    );
};

export default CreateArticle;