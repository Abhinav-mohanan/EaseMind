import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

const Pagination = ({currentPage,totalPages,onPageChange}) => {
    if(totalPages < 1) return null
    
    const getPageNumbers = () =>{
        const pages = []
        const showEllipsis = totalPages > 7
        
        if (!showEllipsis){
            for (let i = 1; i<= totalPages;i++){
                pages.push(i)
            }
        }else{
            pages.push(1)
            
            if (currentPage > 4){
                pages.push('...')
            }
            const start = Math.max(2,currentPage - 1)
            const end = Math.min(totalPages - 1,currentPage + 1)
            
            for(let i = start; i <= end;i++){
                if(i !== 1 && i !== totalPages){
                    pages.push(i)
                }
            }
            if(currentPage < totalPages - 3){
                pages.push('...')
            }

            if (totalPages > 1){
                pages.push(totalPages)
            } 
        }
        return pages
    }

    const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center mt-8 mb-5">
      <nav className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">Previous</span>
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium border ${
                  currentPage === page
                    ? 'bg-teal-600 text-white border-teal-600 hover:bg-teal-700'
                    : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="mr-1 hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  )
}

export default Pagination