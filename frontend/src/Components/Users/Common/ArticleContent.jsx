import React from 'react'

const ArticleContent = ({content}) => {
  return (
    <article className="prose prose-lg max-w-none font-['Lora',serif] text-[#343A40] prose-headings:font-['Inter',sans-serif] prose-p:leading-relaxed prose-a:text-[#5D7B9A]">
      <p>
        {content}
      </p>
    </article>
  );
}

export default ArticleContent