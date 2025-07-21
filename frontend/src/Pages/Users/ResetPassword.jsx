import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import reset_img from '../../assets/image_src.jpeg'
import { ResetPasswordApi } from '../../api/authApi'
import { toast } from 'react-toastify'
import ErrorHandler from '../../Components/Layouts/ErrorHandler'
import { Eye, EyeOff } from 'lucide-react'
import Loading from '../../Components/Layouts/Loading'


const ResetPassword = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const {email,otp} = location.state || {}
    const [errors,setErrors] = useState({})
    const [isLoading,setIsLoading] = useState(false)
    const [showPassword,setShowPassword] =useState(false)
    const [showConfirmPassword,setShowConfirmPassword] =useState(false)

    const [formData,setFormData] = useState({
        email:email || '',
        otp:otp || '',
        password:'',
        confirm_password:''
    })

    useEffect(()=>{
        if(!email || !otp){
            navigate('/forgot-password')
        }
    },[email,otp,navigate])

    const handleChange = (e) =>{
        setFormData({...formData,[e.target.name]:e.target.value})
        setErrors({...errors,[e.target.name]:''})
    }

    const validateForm = (e) =>{
        let formError = {}
       if (formData.password.trim() === ''){
        formError.password = 'Password is requiredd'
       }
       if(formData.confirm_password.trim() === ''){
        formError.confirm_password = 'Confirm password is required'
       }
       if(formData.password.trim() !=='' &&
        formData.confirm_password.trim() !== ''&&
        formData.password !== formData.confirm_password
       ){
        formError.confirm_password = 'Passwords do not match'
       }
       const value = formData['password']
       if (!formError.password && !formError.confirm_password && value.length < 6){
        formError.password = 'Password must be at least 6 characters'
       }
        setErrors(formError)
        return Object.keys(formError).length === 0
    }

    const handleSubmit = async(e) =>{
        e.preventDefault()
        if (!validateForm()) return
        try{
            setIsLoading(true)
            const data = await ResetPasswordApi(formData)
            toast.success(data.message)
            navigate('/login',{replace:true})
        }catch(error){
            ErrorHandler(error)
        }finally{
          setIsLoading(false)
        }

    }

  return (
    <Loading isLoading={isLoading}>
    <div className="flex h-screen">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src={reset_img}
          alt="Psychology consultation room"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-8 left-8 max-w-sm">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
            <p className="font-medium italic">
                "EaseMind — Professional support for your path to mental wellness."
            </p>
          </div>
        </div>
      </div>
      <div className="w-1/2 flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-semibold mb-4">Reset Password</h1>
        <p className="text-gray-500 text-center mb-6">
          Enter your new password.
        </p>
        <div className="w-full max-w-md">
          <div className="mb-4 relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:cursor-not-allowed"
              disabled
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword?'text':'password'}
              name="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
                onClick={()=>setShowPassword(!showPassword)}
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                
            >
            {showPassword?<EyeOff size={18}/> :<Eye size={18}/>}
            </button>            
            {errors.password &&(
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <div className="mb-4 relative">
            <input
              type={showConfirmPassword?'text':'password'}
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
                onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                
            >
            {showConfirmPassword?<EyeOff size={18}/> : <Eye size={18}/>}
            </button>            
            {errors.confirm_password &&(
                <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="mt-6 w-full max-w-md p-3 bg-teal-700 text-white rounded-full hover:bg-teal-800"
        >
          Reset Password
        </button>
      </div>
    </div>
  </Loading>
  )
}

export default ResetPassword