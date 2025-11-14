import React, { useState } from 'react'
import { Eye, Heart, User } from 'lucide-react';
import { ToggleLikeApi } from '../../../api/articlesApi';
import ErrorHandler from '../../Layouts/ErrorHandler';
import { toast } from 'react-toastify';

const EngagementAuthor = ({ likes, views, author,is_liked,article }) => {
  const role = localStorage.getItem('role')
  const isLoggedIn = role !== null && role !== "null" && role !== "undefined";
  const [likeCount,setLikeCount] = useState(likes)
  const [liked,setLiked] = useState(is_liked)

  const handleLike = async() =>{
    if(!role){
      toast.warn("Please login to like")
      return
    }
    try{
      const data = await ToggleLikeApi(article.id)
      setLikeCount(data.likes)
      setLiked(data.is_liked)
    }catch(error){
      ErrorHandler(error)
    }
  }

  return (
    <div> 
      <div className="flex items-center justify-between py-8 mt-8 border-t border-b border-[#DEE2E6]">
        <div className="flex items-center gap-6">
          <button 
            disabled={!isLoggedIn}
            onClick={handleLike}
            className={`flex items-center gap-2 text-[#6C757D] hover:text-[#5D7B9A] disabled:cursor-not-allowed transition-colors group`}>
            <Heart 
              size={20} 
              className={`${liked ? 'fill-pink-500 text-pink-500' : ''} group-hover:text-pink-500`}/>
            <span className="text-sm font-medium">{likeCount} Likes</span>
          </button>
          <div className="flex items-center gap-2 text-[#6C757D]">
            <Eye size={20} />
            <span className="text-sm font-medium">{views} Views</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-6 my-10">
        <div className="flex flex-col sm:flex-row items-start gap-6">
            {author?.image_url ?(
            <img
            src={author.image_url} 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-24 h-24 flex-shrink-0"/>
        ):(
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-24 h-24 flex-shrink-0">  
            <User className='w-24 h-24'/>
            </div>
        )}
          <div>
            <h3 className="text-lg font-bold text-[#343A40] uppercase">{author?.name || 'Psychologist'}</h3>
            <p className="text-sm text-[#5D7B9A] mb-2">{author?.specialization|| 'General'}</p>
            <p className="text-sm text-[#6C757D] leading-relaxed">{author?.bio ||'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default EngagementAuthor