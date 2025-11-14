import React from 'react'
import { ArrowRight, BookOpen, Eye, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ category, title, author_name, created_at, content, likes, total_readers, cover_image,id }) => {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-[#CFDBE7] bg-gray-50 shadow-sm transition-shadow hover:shadow-md md:flex-row">
      {cover_image ? (
        <img 
        alt={title} 
        className="h-48 w-full object-cover md:h-auto md:w-52" 
        src={cover_image} 
      />
      ):(
        <div className="h-48 w-full object-cover md:h-auto md:w-52">
        <BookOpen className="w-full h-48 text-teal-600" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#3A7CA5]/10 px-3 py-1 text-xs uppercase font-medium text-[#3A7CA5]">
            {category || 'General'}
          </span>
        </div>
        <h4 className="mt-3 text-xl font-bold leading-tight tracking-tight text-[#333333]">
          {title}
        </h4>
        <p className="mt-1 text-sm text-[#6B7280]">
          By {author_name} • {new Date(created_at).toLocaleDateString()}
        </p>
        <p className="mt-3 flex-grow text-base text-[#333333]/90">
        {content.length > 180
        ? `${content.substring(0, 180)}...`
        : content}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[#6B7280]">
            <div className="inline-flex items-center gap-1.5">
              <ThumbsUp size={18} />
              <span className="text-sm font-medium">{likes || '0'}</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <Eye size={18} />
              <span className="text-sm font-medium">{total_readers}</span>
            </div>
          </div>
          <Link to={`/article/detail/${id}`} className="inline-flex items-center gap-1 text-sm font-bold text-[#3A7CA5] hover:underline">
            Read More
            <ArrowRight size={16} />
          </Link >
        </div>
      </div>
    </article>
  );
};

export default ArticleCard