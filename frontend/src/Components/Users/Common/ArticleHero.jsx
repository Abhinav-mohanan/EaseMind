import React from 'react'

const ArticleHero = ({ imageUrl, title, author, date, defaultImage,formatDate}) => {
  return (
    <div>
    {imageUrl ? (
        <img 
        src={imageUrl}
        className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl min-h-[320px] md:min-h-[400px] mb-8"
        alt={author}
        />
    ):(
        defaultImage
    )}
      <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-[#343A40] text-left pb-3">
        {title}
      </h1>
      <p className="text-[#6C757D] text-sm font-normal leading-normal pb-6">
        By {author} | Published on {formatDate(date)} 
      </p>
    </div>
  );
};

export default ArticleHero