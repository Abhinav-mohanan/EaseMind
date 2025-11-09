import React from 'react'
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogCard = ({id, category, title, content, cover_image, }) => {
  return (
    <div className="bg-slate-50 p-6 rounded-2xl flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
      <img 
        alt={title} 
        className="rounded-lg aspect-video object-cover mb-6" 
        src={cover_image} 
      />
      <div className="flex-grow">
        <span className={'text-sm font-semibold text-customBlue mb-2 inline-block'}>
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