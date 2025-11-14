import { SearchX } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ArticleCard from '../../Layouts/ArticleCard';
import ErrorHandler from '../../Layouts/ErrorHandler';
import { ArticlesListApi } from '../../../api/articlesApi';
import Pagination from '../../Layouts/Pagination';

const ArticlesList = ({search,category,author,sort,filterTrigger}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [articles, setArticles] = useState([]);
  const page_size = 6;

  const fetchArticles = async (page) => {
    try {
      setIsLoading(true);
      const data = await ArticlesListApi(page,search,category,author,sort);
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
  }, [currentPage, search,filterTrigger]);

  const handlePageChange = (pageNum) => {
    if (pageNum > 0 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="lg:col-span-9">
      <div className="grid grid-cols-1 gap-8">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <span className="text-gray-500 text-lg">Loading...</span>
          </div>
        ) : articles.length > 0 ? (
          <>
            {articles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="col-span-1 rounded-xl border border-dashed border-[#CFDBE7] bg-white p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#3A7CA5]/10">
              <SearchX className="text-[#3A7CA5]" size={28} />
            </div>
            <h4 className="mt-4 text-lg font-bold text-black">No Articles Found</h4>
            <p className="mt-1 text-[#6B7280]">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesList;
