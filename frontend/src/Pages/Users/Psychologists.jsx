import React, { useEffect, useState } from 'react'
import { FetchPsychologistApi } from '../../api/appointmentApi'
import ErrorHandler from '../../Components/Layouts/ErrorHandler'
import Navbar from '../../Components/Users/Navbar';
import Pagination from '../../Components/Layouts/Pagination';
import Footer from '../../Components/Users/Footer';
import { Users } from 'lucide-react';

const PsychologistsList = () => {
    const [psychologists,setPsychologists] = useState([])
    const [currentPage,setCurrentPage] = useState(1)
    const [totalPages,setTotalPages] = useState(1)
    const [isLoading,setIsLoading] = useState(false)
    const page_size = 6

    const fetchpsychologist = async(page=1) =>{
        try{
            setIsLoading(true)
            const data = await FetchPsychologistApi(page)
            setPsychologists(data.results)
            setTotalPages(Math.ceil(data.count / page_size))
        }catch(error){
            ErrorHandler(error)
        }finally{
            setIsLoading(false)
        }
    }
    
    useEffect(()=>{
        fetchpsychologist(currentPage)
    },[currentPage])

    const handlePageChange = (pageNum) =>{
        if(pageNum > 0 && pageNum <= totalPages){
            setCurrentPage(pageNum)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {/* Hero Section */}
            <div className="bg-gray-50 text-black-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Explore Our Licensed Psychologists
                    </h1>
                    <p className="text-xl text-black-100 max-w-3xl mx-auto">
                        Our team of licensed psychologists is dedicated to providing personalized mental health support. 
                        Each therapist brings unique expertise and a compassionate approach to help you on your journey to better mental health.
                    </p>
                </div>
            </div>

            <main className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {psychologists.length > 0 ?(
                            psychologists.map(psychologist => (
                                <div 
                                    key={psychologist.id} 
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                                >
                                    {/* Profile Image Container */}
                                    <div className="relative bg-gradient-to-br from-teal-50 to-blue-50 p-8 text-center">
                                        <div className="relative inline-block">
                                            <img
                                                src={psychologist.profile_pic}
                                                alt={psychologist.name}
                                                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                                            />
                                        </div>
                                    </div>
    
                                    {/* Content */}
                                    <div className="p-6">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                                            {psychologist.name}
                                        </h2>
                                        
                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center text-gray-600">
                                                <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                                                <span className="text-sm font-medium">
                                                    <span className="text-gray-800">Specialization:</span> {psychologist.specialization}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center text-gray-600">
                                                <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                                                <span className="text-sm font-medium">
                                                    <span className="text-gray-800">Experience:</span> {psychologist.experience_years} years
                                                </span>
                                            </div>
                                        </div>
                                            <div 
                                            className='w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-serif font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl block text-center'>
                                        See profile
                                        </div>
                        
                                    </div>
                                </div>
                            ))
                        ):(
                            <div className="col-span-full text-center py-12 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg">
                                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600 text-lg">No psychologist available this moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            {totalPages > 1 &&(
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
            )}
            <Footer/>
        </div>
    );
};

export default PsychologistsList