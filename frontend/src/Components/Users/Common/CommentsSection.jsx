import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { DeleteCommentApi, EditCommentApi, GetCommentsApi, PostCommentApi } from '../../../api/articlesApi';
import ErrorHandler from '../../Layouts/ErrorHandler';
import Pagination from '../../Layouts/Pagination';
import { Delete, Edit, Trash, User } from 'lucide-react';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../Layouts/ConfirmationModal';

const CommentsSection = () => {
  const role = localStorage.getItem('role');
  const isLoggedIn = role !== null && role !== "null" && role !== "undefined";
  const {article_id} = useParams()
  const [comment, setComment] = useState('')
  const [comments,setComments] = useState([])
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isDeleteModalOpen,setIsDeleteModalOpen] = useState(false)
  const [currentPage,setCurrentPage] = useState(1)
  const [totalPages,setTotalPages] = useState(1)
  const page_size = 6

  const fetchComments = async(page=1) =>{
    try{
      const data = await GetCommentsApi(article_id,page)
      setComments(data.results)
      setTotalPages(Math.ceil(data.count / page_size))
    }catch(error){
      ErrorHandler(error)
    }
  }

  const handleSubmit = async() => {

    try{
      const data = await PostCommentApi(article_id,comment)
      toast.success(data?.message)
      setComment('');
      fetchComments(currentPage)
    }catch(error){
      ErrorHandler(error)
    }
    }

    useEffect(()=>{
      fetchComments(currentPage)
    },[currentPage])

    const startEditing = (c) =>{
      setEditingId(c.id)
      setEditText(c.comment)
    }

    const handleEditSave = async() =>{
      try{
        const data = await EditCommentApi(editingId,editText)
        toast.success(data?.message)
        setEditingId(null)
        setEditText('')
        fetchComments(currentPage)
      }catch(error){
        ErrorHandler(error)
      }
    }

    const handleDelete = (id) =>{
      setDeletingId(id)
      setIsDeleteModalOpen(true)
    }
    
    const handleCancel = () =>{
      setIsDeleteModalOpen(false)
    }

    const confirmDelete = async() =>{
      if (!deletingId) return
      try{
        const data = await DeleteCommentApi(deletingId)
        toast.success(data?.message)
        setDeletingId(null)
        setIsDeleteModalOpen(false)
        fetchComments(currentPage)
      }catch(error){
        ErrorHandler(error)
      }
    }

    const handlePageChange = (pageNum) =>{
      if(pageNum > 0 && pageNum <= totalPages){
        setCurrentPage(pageNum)
      }
    }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold border-b border-[#DEE2E6] pb-4 text-[#343A40]">
        Comments ({comments.length})
      </h2>
      <div className="flex items-start gap-4">
        
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
          <User className="text-gray-600" />
        </div>

        <div className="flex-1">
          <textarea 
            className="w-full rounded-md border border-[#DEE2E6] bg-transparent p-3 text-sm focus:ring-2 focus:ring-[#5D7B9A] focus:border-[#5D7B9A] transition text-[#343A40]" 
            placeholder="Add a comment..." 
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button 
              disabled={!isLoggedIn}
              onClick={handleSubmit}
              className="bg-[#5D7B9A] text-white text-sm font-semibold py-2 px-4 rounded-lg disabled:cursor-not-allowed hover:bg-opacity-90 transition-colors"
            >
              Post Comment
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {comments.map((c) => (
          <div key={c.id} className="flex items-start gap-4">
            
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10"
              style={{backgroundImage: `url("${c.user_image || ''}")`}}
            >
              {!c.user_image && <User className="w-10 h-10 text-gray-400" />}
            </div>
            
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm text-[#343A40]">{c.user_name}</p>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-[#6C757D]">{c.time_ago}</p>

                    {c.is_owner && (
                      <>
                        <button 
                          onClick={() => startEditing(c)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          <Edit className='w-4 h-4 mx-2'/>
                        </button>
                        <button 
                          onClick={() => handleDelete(c.id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          <Trash className='w-4 h-4'/>
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {editingId === c.id ? (
                  <div>
                    <textarea
                      className="w-full p-2 border rounded-md bg-white"
                      rows="3"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="flex gap-2 mt-2 justify-end">
                      <button
                        onClick={handleEditSave}
                        className="text-white bg-green-600 px-3 py-1 rounded-md text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-white bg-gray-500 px-3 py-1 rounded-md text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-[#343A40]">{c.comment}</p>
                )}
              </div>
            </div>

          </div>
        ))}
        {totalPages > 1 &&(
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
      )}
      </div>
      <ConfirmationModal 
      onClose={handleCancel} 
      onConfirm={confirmDelete} 
      title='Delete Article'
      message='Are you sure you want to delete this comment?'
      confirmText='Delete'
      isOpen={isDeleteModalOpen}/>
    </div>
  )
}


export default CommentsSection