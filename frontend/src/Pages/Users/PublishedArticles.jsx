import React, { useState } from 'react';
import Navbar from '../../Components/Users/Common/Navbar';
import Footer from '../../Components/Users/Common/Footer';
import FilterSidebar from '../../Components/Users/Common/FilterSidebar';
import ArticlesList from '../../Components/Users/Common/ArticlesList';
import useDebounce from '../../Hooks/useDebounce';

const PublishedArticles = () => {
  const [search,setSearch] = useState('')
  const [category,setCategory] = useState('all')
  const [author,setAuthor] = useState('')
  const [sort,setSort] = useState('newest')
  const [filterTrigger,setFilterTrigger] = useState(false)
  const debouncedSearch = useDebounce(search)

  const onApplyFilters = () =>{
    setFilterTrigger(prev => !prev)
  }

  const ResetFilters = () =>{
    setSearch('')
    setCategory('all')
    setAuthor('')
    setSort('newest')
    setFilterTrigger(prev =>!prev)
  }
    
     return (
        <>
      <Navbar />
      
      <main className="flex w-full flex-1 justify-center py-8 pt-16">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold pt-8 sm:text-5xl text-[#333333]">
              Published Articles
            </h1>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            <FilterSidebar
            search={search}
            category={category}
            author={author}
            sort={sort}
            setSearch={setSearch}
            setCategory={setCategory}
            setAuthor={setAuthor}
            setSort={setSort} 
            onApplyFilters={onApplyFilters}
            ResetFilters={ResetFilters} />

            <ArticlesList 
            category={category}
            author={author}
            sort={sort}
            filterTrigger={filterTrigger}
            debouncedSearch={debouncedSearch}/>
          </div>
        </div>
      </main>
      
      <Footer />
        </>      
     )
    }
         


export default PublishedArticles;