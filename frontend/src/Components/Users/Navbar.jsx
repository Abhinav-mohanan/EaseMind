import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {  
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