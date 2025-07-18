import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import { toast } from 'react-toastify'
import ErrorHandler from '../Layouts/ErrorHandler'


const Navbar = () => {  
  useEffect(()=>{
    const fetch = async() =>{
      try{
        const response = await axiosInstance.get('/test/')
        toast.success(response.data.message)

      }catch(error){
        ErrorHandler(error)
      }
    }
    fetch()
  },[])
  return (
        <nav className='bg-white shadow-md p-4 flex justify-between items-center'>
        <div className='text-2xl font-bold text-teal-500'>EaseMind</div>
        <div className='flex items-center space-x-6'>
            <Link to="#" className='text-gray-700 hover:text-teal-700'>Home</Link>
            <Link to="#" className='text-gray-700 hover:text-teal-700'>Articles</Link>
            <Link to="#" className='text-gray-700 hover:text-teal-700'>Therapyist</Link>
            <Link to="#" className='text-gray-700 hover:text-teal-700'>Contact us</Link>
            <button className='text-red-500 border border:gray-400 hover:text-700'>Logout</button>
        </div>
    </nav>
  )
}

export default Navbar