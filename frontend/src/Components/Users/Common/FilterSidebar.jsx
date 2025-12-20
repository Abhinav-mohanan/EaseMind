import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react';
import { FetchAllCategory } from '../../../api/articlesApi';
import ErrorHandler from '../../Layouts/ErrorHandler';

const FilterSidebar = ({search,category,author,sort,setSearch,setCategory,setAuthor,setSort,onApplyFilters,ResetFilters}) => {
  const [categories,setCategories] = useState([])

  const fetchCategoies = async() =>{
    try{
      const data = await FetchAllCategory()
      setCategories(data)
    }catch(error){
      ErrorHandler(error)
    }
  }

  const handleSearch = (e) =>{
    e.preventDefault()
    setSearch(e.target.value)
  }

  useEffect(()=>{
    fetchCategoies()
  },[])

  return (
    <aside className="lg:col-span-3 bg-white">
      <div className="sticky top-24 space-y-6">
        <div>
          <label className="flex flex-col">
            <div className="flex h-12 w-full flex-1 items-stretch rounded-lg bg-white border border-[#CFDBE7]">
              <div className="flex items-center justify-center pl-4 bg-white text-[#6B7280]">
                <Search size={20} />
              </div>
              <input 
                value={search}
                onChange={handleSearch}
                className="w-full flex-1 resize-none overflow-hidden rounded-r-lg border-none bg-transparent pl-2 text-base font-normal placeholder:text-[#6B7280] focus:outline-none focus:ring-0" 
                placeholder="Search articles..."
              />
            </div>
          </label>
        </div>
        
        <h3 className="text-lg font-bold tracking-tight pt-4 text-[#333333]">Filter Articles</h3>
        
        <div className="space-y-4">
          <label className="flex flex-col">
            <p className="pb-2 text-sm font-medium text-[#333333]">Topic / Category</p>
            <select
            value={category}
            onChange={(e)=>setCategory(e.target.value)}
            className='w-full rounded-lg border-[#CFDBE7] bg-white h-12 text-sm focus:border-[#3A7CA5] uppercase focus:ring-[#3A7CA5] placeholder:text-[#6B7280] text-gray-700 font-bold'>
                <option value='all'> all</option>
                {categories.map((cat)=>(
                    <option key={cat.id} value={cat.name} className='uppercase'>  
                    {cat.name} 
                    </option>
                ))}
            </select>
          </label>
          
          <label className="flex flex-col">
            <p className="pb-2 text-sm font-medium text-[#333333]">Author</p>
            <input 
              value={author}
              onChange={(e)=>setAuthor(e.target.value)}
              className="w-full rounded-lg border-[#CFDBE7] bg-white h-12 text-sm focus:border-[#3A7CA5] focus:ring-[#3A7CA5] placeholder:text-[#6B7280] text-gray-700 font-bold" 
              placeholder="Search by author name" 
              type="text"
            />
          </label>
          
          <label className="flex flex-col">
            <p className="pb-2 text-sm font-medium text-[#333333]">Sort By</p>
            <select
            value={sort}
            onChange={(e)=>setSort(e.target.value)}
            className="w-full rounded-lg border-[#CFDBE7] bg-white h-12 text-sm focus:border-[#3A7CA5] focus:ring-[#3A7CA5] text-gray-700 font-bold">
              <option value='newest'>Newest First</option>
              <option value='oldest'>Oldest First</option>
            </select>
          </label>
        </div>
        
        <div className="flex flex-col space-y-2 pt-4">
          <button
          onClick={()=>onApplyFilters()}
          className="flex h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-[#3A7CA5] text-sm font-bold text-white hover:bg-[#2d6280] transition-colors">
            Apply Filters
          </button>
          <button 
          onClick={()=>ResetFilters()}
          className="flex h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-transparent text-sm font-bold text-[#6B7280] hover:bg-[#3A7CA5]/10 transition-colors">
            Reset
          </button>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar