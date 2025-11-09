import React from 'react'
import BlogCard from '../../Layouts/BlogCard';
import { useArticles } from '../../../Hooks/useArticles';
import { Link } from 'react-router-dom';

const BlogSection = () => {
  const blogs = useArticles()

  return (
    <>
    {blogs.length > 0 &&(
        
        <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Insights from Our Experts
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-gray-800">
            Explore articles on mental wellness, personal growth, and strategies for a balanced life.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
              <BlogCard key={blog.id} {...blog} />
            ))}
        </div>
        <div className="text-center mt-12">
          <Link to='/articles' className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-full text-lg 
          hover:bg-blue-700 transition-all shadow-md">
            View All Articles
          </Link>
        </div>
      </div>
    </section>
    )}
    </>
  );
};

export default BlogSection