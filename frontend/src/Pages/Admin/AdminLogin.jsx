import React, { useState } from 'react'
import { AdminLoginApi } from '../../api/adminApi'
import { toast } from 'react-toastify'
import ErrorHandler from '../../Components/Layouts/ErrorHandler'
import { Eye, EyeClosed } from 'lucide-react'
import Login_img from '../../assets/Login_img.jpg'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
    const navigate = useNavigate()
    const [formData,setFormData] = useState({
      email:'',
      password:''
    })
    const [errors,setErrors] = useState({})
    const [showPassword,setShowPassword] = useState(false)
    const [isLoading,setIsLoading] = useState(false)

    const handleChange = (e) =>{
        setFormData({...formData,[e.target.name]:e.target.value})
        setErrors({...errors,[e.target.name]:''})
    }

    const formValidate = () =>{
        const formError = {}
        if(formData.email.trim()  === ''){
            formError.email = "Email is required"
        }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)){
            formError.email = 'Enter valid email'
        }

        if(formData.password.trim() === ''){
            formError.password = 'Password is required'
        }
        setErrors(formError)
        return Object.keys(formError).length === 0
    }

    const handleSubmit = async(e) =>{
        e.preventDefault()
        if(!formValidate()) return
        try{
            setIsLoading(true)
            const data = await AdminLoginApi(formData)
            toast.success(data.message)
            navigate('/admin/dashboard')
        }catch(errors){
            ErrorHandler(errors)
        }finally{
            setIsLoading(false)
        }

    }

    const togglePasswordVisibility = () =>{
        setShowPassword(!showPassword)
    }
    const handleKeydown = (e)=>{
      if (e.key === 'Enter'){
        e.preventDefault()
        handleSubmit(e)
      }
    }

  return (
    <div className='flex min-h-screen'>
      <div className='w-1/2 bg-gray-100 flex items-center justify-center'>
        <img src={Login_img} alt="Admin Login" className='rounded-lg shadow-lg h-full'/>
      </div>
      <div className='w-1/2 flex flex-col items-center justify-center p-8'>
        <h1 className='text-2xl font-semibold mb-4'>Admin Login - EaseMind</h1>
        <p className='text-grey-500 text-center mb-6'>Access the admin panel to manage users and settings.</p>

        <div className='w-full max-w-md'>
          <div className='mb-4'>
            <input
              type='email'
              name='email'
              placeholder='Email'
              value={formData.email}
              onChange={handleChange}
              className='w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400'
            />
            {errors.email && (
              <p className='text-red-500 text-sm mt-1 ml-2'>{errors.email}</p>
            )}
          </div>
          <div className='mb-4 relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              placeholder='Password'
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleKeydown}
              className='w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400'
            />
            <span
              className='absolute right-4 top-3 text-gray-600 cursor-pointer'
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
            </span>
            {errors.password && (
              <p className='text-red-500 text-sm mt-1 ml-2'>{errors.password}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className='mt-6 w-full max-w-md p-3 bg-teal-700 text-white rounded-full hover:bg-teal-800'
        >
          LOGIN
        </button>
      </div>
    </div>
  )
}

export default AdminLogin