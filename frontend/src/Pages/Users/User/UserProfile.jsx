import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FetchUserDetail, UserProfileApi } from '../../../api/authApi'
import ErrorHandler from '../../../Components/Layouts/ErrorHandler'
import { toast } from 'react-toastify'
import { User, Mail, Phone, Users, Calendar, Camera, Edit, X, Save, CheckCircle } from 'lucide-react'
import UserSidebar from '../../../Components/Users/User/UserSidebar'
import Navbar from '../../../Components/Users/Navbar'

const UserProfile = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    gender: '',
    date_of_birth: '',
    profile_picture: null,
  });
  const [isLoading, setIsLoading] = useState(true)
  const [role, setRole] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [initialData, setInitialData] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors,setErrors] = useState({})

  const calculateProgress = (data) => {
    const fields = ['first_name', 'last_name', 'phone_number', 'gender', 'date_of_birth']
    const filledFields = fields.filter((field) => data[field]).length
    return Math.round((filledFields / fields.length) * 100)
  }

  const fetchUser = async () => {
    try {
      const res = await FetchUserDetail()
      console.log('API Response:', res)
      const data = {
        first_name: res.first_name || '',
        last_name: res.last_name || '',
        email: res.email || '',
        phone_number: res.phone_number || '',
        gender: res.gender || '',
        date_of_birth: res.date_of_birth || '',
        profile_picture: res.data?.profile_picture || res.profile_picture || '',
      };
      setFormData(data)
      setInitialData(data)
      setRole(res.role)
      setProgress(calculateProgress(data))
      setImagePreview(res.data?.profile_picture || res.profile_picture || null)
    } catch (error) {
      ErrorHandler(error)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    if (!isLoading && role !== 'user') {
      navigate('/')
    }
  }, [role, isLoading, navigate])

  const handleChange = (e) => {
    const updatedFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedFormData);
    setProgress(calculateProgress(updatedFormData))
    setErrors({...errors,[e.target.name]:''})
  };

  const handleSelectChange = (field, value) => {
    const updatedFormData = { ...formData, [field]: value }
    setFormData(updatedFormData)
    setProgress(calculateProgress(updatedFormData))
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
        toast.error('Profile picture must be PNG, JPG, WEBP, or JPEG');
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Profile picture must be less than 5MB')
        return
      }
      setFormData({ ...formData, profile_picture: file });
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  };

  const handleCancel = () => {
    if (initialData) {
      setFormData(initialData);
      setProgress(calculateProgress(initialData));
      setImagePreview(typeof initialData.profile_picture === 'string' ? initialData.profile_picture : null);
    }
    setIsEditing(false);
  };

    const formValidate = () => {
    const formErrors = {}

    // Validate First Name
    if (formData.first_name.trim() === '') {
        formErrors.first_name = 'First name is required'
    } else if (!/^[A-Za-z]+$/.test(formData.first_name)) {
        formErrors.first_name = 'Enter a valid first name'
    }

    // Validate Last Name
    if (formData.last_name.trim() === '') {
        formErrors.last_name = 'Last name is required'
    } else if (!/^[A-Za-z]+$/.test(formData.last_name)) {
        formErrors.last_name = 'Enter a valid last name'
    }

    // Validate Phone Number
    if (formData.phone_number.trim() === '') {
        formErrors.phone_number = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
        formErrors.phone_number = 'Enter a valid 10-digit phone number'
    }

    setErrors(formErrors) 
    return Object.keys(formErrors).length === 0
    }


  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!formValidate()) return
    const formDataToSend = new FormData();
    for (const key in formData) {
      const value = formData[key];
      if (value !== null && value !== '') {
        formDataToSend.append(key, value);
      }
    }
    try {
      setIsLoading(true);
      const res = await UserProfileApi(formDataToSend);
      const updatedData = { ...formData, profile_picture: res.profile_picture || formData.profile_picture };
      setFormData(updatedData);
      setInitialData(updatedData);
      setImagePreview(res.profile_picture || null);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = () => {
    const firstName = formData.first_name || '';
    const lastName = formData.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getFullName = () => {
    const firstName = formData.first_name || '';
    const lastName = formData.last_name || '';
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    return 'User Profile';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserSidebar />
        <div className="ml-0 lg:ml-64">
          <Navbar />
          <div className="p-4 lg:p-8">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                  <span className="ml-4 text-gray-600 text-lg">Loading profile...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserSidebar />
      <div className="ml-0 lg:ml-64 transition-all duration-300">
        <Navbar />
        <div className="p-4 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-600 h-32 lg:h-40"></div>
              <div className="relative px-6 lg:px-8 pb-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6 -mt-16 lg:-mt-20">
                  
                  {/* Profile Picture */}
                  <div className="relative">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className="w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white shadow-lg" 
                      />
                    ) : (
                      <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-2xl lg:text-3xl font-bold text-white border-4 border-white shadow-lg">
                        {getInitials() || <User className="w-10 h-10 lg:w-12 lg:h-12" />}
                      </div>
                    )}
                    {isEditing && (
                      <>
                        <button
                          type="button"
                          className="absolute bottom-0 right-0 bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-full shadow-lg transition-colors"
                          onClick={() => document.getElementById('avatar-upload')?.click()}
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </>
                    )}
                  </div>
                  
                  {/* Profile Info */}
                  <div className="flex-1 min-w-0 mb-5">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                      <div className="min-w-0">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                          {getFullName()}
                        </h1>
                        <div className="flex items-center gap-2 text-gray-600 mt-2">
                          <Mail className="w-4 h-4 text-teal-500 flex-shrink-0" />
                          <span className="truncate text-gray-800">{formData.email}</span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      {!isEditing ? (
                        <button
                          type="button"
                          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit className="w-4 h-4" />
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            type="button"
                            className="border bg-gray-40 border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            onClick={handleCancel}
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                            onClick={handleSubmit}
                          >
                            <Save className="w-4 h-4" />
                            Save Changes
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Profile Completion: {progress}%
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Complete your profile
                  </p>
                </div>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <User className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Manage your personal details and contact information
                  </p>
                </div>
              </div>
              
              {!isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        First Name
                      </label>
                      <p className="mt-2 text-lg text-gray-900">
                        {formData.first_name || <span className="text-gray-400 italic">Not provided</span>}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Phone Number
                      </label>
                      <div className="flex items-center gap-3 mt-2">
                        <Phone className="w-5 h-5 text-teal-500" />
                        <span className="text-lg text-gray-900">
                          {formData.phone_number || <span className="text-gray-400 italic">Not provided</span>}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Gender
                      </label>
                      <div className="flex items-center gap-3 mt-2">
                        <Users className="w-5 h-5 text-teal-500" />
                        <span className="text-lg text-gray-900 capitalize">
                          {formData.gender || <span className="text-gray-400 italic">Not provided</span>}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Last Name
                      </label>
                      <p className="mt-2 text-lg text-gray-900">
                        {formData.last_name || <span className="text-gray-400 italic">Not provided</span>}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm  font-medium text-gray-500 uppercase tracking-wide">
                        Email Address
                      </label>
                      <div className="flex items-center gap-3 mt-2">
                        <Mail className="w-5 h-5 text-teal-500" />
                        <span className="text-lg font-semibold text-gray-900 truncate">{formData.email}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Date of Birth
                      </label>
                      <div className="flex items-center gap-3 mt-2">
                        <Calendar className="w-5 h-5 text-teal-500" />
                        <span className="text-lg text-gray-900">
                          {formData.date_of_birth || <span className="text-gray-400 italic">Not provided</span>}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                      />
                    {errors.first_name &&(
                        <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
                    )}
                    </div>
                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        />
                        {errors.last_name &&(
                            <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
                        )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>
                    <div>
                      <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        />
                        {errors.phone_number &&(
                            <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
                        )}
                    </div>
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        id="gender"
                        value={formData.gender}
                        onChange={(e) => handleSelectChange('gender', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4  py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 bg-white"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        id="date_of_birth"
                        name="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      onClick={handleCancel}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;