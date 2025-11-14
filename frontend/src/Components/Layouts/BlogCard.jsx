import React from 'react'
import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogCard = ({id, category, title, content, cover_image, }) => {
  return (
    <div className="bg-slate-50 p-6 rounded-2xl flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
      {cover_image ?(
        <img 
        alt={title} 
        className="rounded-lg aspect-video object-cover mb-6" 
        src={cover_image} 
        />
      ):(
        <div className="rounded-lg aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-6">
        <BookOpen className="w-16 h-16 text-teal-600 opacity-80" />
        </div>
      )}
      <div className="flex-grow">
        <span className={'text-sm font-semibold text-customBlue mb-2 uppercase inline-block'}>
          {category || "General"}
        </span>
        <h3 className="text-xl font-bold text-slate-900  mb-3">
          {title}
        </h3>
        <p className="text-slate-600 mb-6">
          {content.length >   100 
          ? `${content.substring(0,100)}...`
          :content}
        </p>
      </div>
      <Link to={`article/detail/${id}`} className="font-semibold text-customBlue flex items-center group-hover:underline" href="#">
        Read More <ArrowRight className="ml-1" size={18} />
      </Link>
    </div>
  );
};

export default BlogCard