import React, { useEffect, useState } from 'react'
import { Folder, Plus } from 'lucide-react'
import AdminSidebar from '../../Components/Admin/AdminSidebar'
import AdminHeader from '../../Components/Admin/AdminHeader'
import { CategoryFetch, CreateCategory, DeleteCategory, UpdateCategory } from '../../api/articlesApi'
import ErrorHandler from '../../Components/Layouts/ErrorHandler'
import Pagination from '../../Components/Layouts/Pagination'
import { toast } from 'react-toastify'
import CategoryTable from '../../Components/Users/Common/CategoryTable'
import CategoryModal from '../../Components/Users/Common/CategoryModal'
import ConfirmationModal from '../../Components/Layouts/Confirmationmodal'
import Breadcrumbs from '../../Components/Layouts/Breadcrumbs'

const AddCategory = () => {
    const [categories,setCategories] = useState([])
    const [isLoading,setIsLoading] = useState(false)
    const [isModalOpen,setIsModalOpen] = useState(false)
    const [isDeleteModalOpen,setIsDeleteModalOpen] = useState(false)
    const [newCategory,setNewCategory] = useState('')
    const [editCategory,setEditCategory] = useState(null)
    const [deleteCategory,setDeleteCategory] = useState(null)
    const [error,setError] = useState('')
    const [currentPage,setCurrentPage] = useState(1)
    const [totalPages,setTotalPages] = useState(1)
    const page_size = 6

    const breadcrumbItems = [
        {label:'Articles',link:'/admin/articles'},
        {label:'Categories',link:null}
    ]

    const fetchCategories = async (page=1) =>{
        try{
            setIsLoading(true)
            const data = await CategoryFetch(page)
            setCategories(data.results)
            setTotalPages(Math.ceil(data.count / page_size))
        }catch(error){
            ErrorHandler(error)
        }finally{
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        fetchCategories(currentPage)
    },[currentPage])

    const validateForm = () =>{
        if (newCategory.trim().length === 0){
            setError("Category name cannot be empty")
            return false
        }
        if (newCategory.trim().length < 3 || newCategory.trim().length >= 20){
            setError("Category name must be between 3 and 20 characters")
            return false
        }
        return true
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();
        if (!validateForm()) return;
        try{
            if (editCategory){
                await handleUpdate(e)
            }else{
                const data = await CreateCategory({name:newCategory})
                toast.success(data.message)
                setNewCategory('')
                fetchCategories(1)
                setIsModalOpen(false)
            }
        }catch(error){
            ErrorHandler(error)
        }
    }

    const handleEdit = (category) =>{
        setEditCategory(category)
        setNewCategory(category.name)
        setError('')
        setIsModalOpen(true)
    }

    const handleCancel = () =>{
        setEditCategory(null)
        setNewCategory('')
        setError('')
        setIsModalOpen(false)
    }

    const handleUpdate = async(e) =>{
        e.preventDefault()
        if (!validateForm()) return;
        try{
            const data = await UpdateCategory(editCategory.id,{name:newCategory})
            toast.success(data.message)
            setNewCategory('')
            setEditCategory(null)
            fetchCategories(currentPage)
            setIsModalOpen(false)
        }catch(error){
            ErrorHandler(error)
        }
    }

    const handleDeleteClick = (category) =>{
        setDeleteCategory(category)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteConfirm = async() =>{
        if(!deleteCategory) return
        try{
            const data = await DeleteCategory(deleteCategory.id)
            toast.success(data.message)
            if (categories.length === 1 && currentPage > 1){
                setCurrentPage(currentPage - 1)
            }else{
                fetchCategories(currentPage)
            }
            setIsDeleteModalOpen(false)
            setDeleteCategory(null)
        }catch(error){
            ErrorHandler(error)
        }
    }

    const handleDeleteCancel = () =>{
        setDeleteCategory(null)
        setIsDeleteModalOpen(false)
    }

    const handlePageChange = (pageNum) =>{
        if ( 0 < pageNum && pageNum <= totalPages){
            setCurrentPage(pageNum)
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { 
            weekday: 'short',
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
    }

    const handleAddNew = () =>{
        setEditCategory(null)
        setNewCategory('')
        setError('')
        setIsModalOpen(true)
    }


 
    return (
        <div className='flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
            <AdminSidebar />
            <div className='flex-1 ml-64 bg-gray-50'>
                <AdminHeader />
                <div className='p-6'>

                    <Breadcrumbs items={breadcrumbItems} />

                    <div className='flex items-center justify-between mb-6'>
                        <div className='flex items-center space-x-3'>
                            <Folder className='w-6 h-6 text-teal-700' />
                            <h1 className='text-2xl font-bold text-slate-800'>Article Categories</h1>
                        </div>
                        <button
                            onClick={handleAddNew}
                            className='inline-flex items-center px-5 py-2 bg-gradient-to-r from-teal-600 to-teal-800
                            text-white font-medium rounded-lg hover:from-teal-700 hover:to-teal-900 transition-all 
                            duration-200 shadow-sm hover:shadow-md'
                        >
                            <Plus className='w-5 h-5 mr-2' /> Add New Category
                        </button>
                    </div>

                    {isLoading ? (
                        <div className='flex justify-center items-center py-12'>
                            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600'></div>
                        </div>
                    ) : (
                        <>
                            {categories.length > 0 ? (
                                <>
                                    <CategoryTable
                                        categories={categories}
                                        onEdit={handleEdit}
                                        onDelete={handleDeleteClick}
                                        formatDate={formatDate}
                                    />
                                    {totalPages > 1 && (
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    )}
                                </>
                            ) : (
                                <div className='bg-white rounded-xl shadow-sm p-12 text-center'>
                                    <Folder className='w-16 h-16 text-slate-300 mx-auto mb-4' />
                                    <p className='text-slate-500 text-lg'>No categories found.</p>
                                    <p className='text-slate-400 text-sm mt-2'>
                                        Click "Add New Category" to create your first category.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <CategoryModal
                    isOpen={isModalOpen}
                    onClose={handleCancel}
                    onSubmit={handleSubmit}
                    category={editCategory}
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    error={error}
                />

                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                    title={`Delete Category "${deleteCategory?.name}"`}
                    message="Are you sure you want to delete this category? This action cannot be undone."
                />
            </div>
        </div>
    )
}

export default AddCategory