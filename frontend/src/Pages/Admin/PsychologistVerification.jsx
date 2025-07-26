import React, { useEffect, useState } from 'react'
import ErrorHandler from '../../Components/Layouts/ErrorHandler'
import { HandlePsychologistVerificationApi, PsychologistVerificationDetailsApi } from '../../api/adminApi'
import { toast } from 'react-toastify'
import AdminSidebar from '../../Components/Admin/AdminSidebar';
import AdminHeader from '../../Components/Admin/AdminHeader';
import Pagination from '../../Components/Layouts/Pagination';

const PsychologistVerification = () => {
    const [isLoading,setIsLoading] = useState(false)
    const [profiles,setProfiles] = useState([])
    const [filter,setFilter] = useState('pending')
    const [currentPage,setCurrentPage] = useState(1)
    const [totalPages,setTotalpage] = useState(1)
    const [expandedProfileId,setExpandedProfileId] = useState(false)
    const pageSize = 6

    const fetchProfiles = async (page,status) => {
        try{
            setIsLoading(true)
            const data = await PsychologistVerificationDetailsApi(page,status)
            setProfiles(data.results)
            setTotalpage(Math.ceil(data.count / pageSize))
        }catch(error){
            ErrorHandler(error)
        }finally{
          setIsLoading(false)
        }
    }

    useEffect(()=>{
      fetchProfiles(currentPage,filter)
    },[currentPage,filter])

    const handleVerification = async(psychologist_id,action)=>{
      try{
        setIsLoading(true)
        const data = await HandlePsychologistVerificationApi(psychologist_id,action)
        toast.success(`profiel ${action}ed successfully`)
        setProfiles(profiles.filter(profile=>profile.user.id != psychologist_id))
        setExpandedProfileId(null)
      }catch(error){
        ErrorHandler(error)
      }finally{
        setIsLoading(false)
      }
    }

    const handleFilterChange = (status)=>{
      setFilter(status)
      setCurrentPage(1)
      setExpandedProfileId(null)
    }

    const handlePageChange = (pageNum) =>{
      if (pageNum > 0 && pageNum <= totalPages){
        setCurrentPage(pageNum)
        setExpandedProfileId(null)
      }
    }

    const toggleProfileDetails = (profileId) =>{
      setExpandedProfileId(expandedProfileId === profileId ? null : profileId)
    }

    const getInitials = (first_name,last_name) =>{
      return `${first_name?.charAt(0) || ''}${last_name?.charAt(0) || ''}`.toUpperCase()
    }
    return (
        <div className='flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
            <AdminSidebar />
            <div className='flex-1 ml-64 bg-gray-50'>
            <AdminHeader />
                <div className='p-6'>
                    <div className='max-w-7xl mx-auto'>
                        {/* Header Section */}
                        <div className='bg-white rounded-2xl shadow-xl border border-slate-200 mb-8 overflow-hidden'>
                            <div className='bg-gradient-to-r from-teal-600 via-teal-600 to-teal-800 px-8 py-6'>
                                <div className='flex items-center space-x-4'>
                                    <div className='p-3 bg-white/20 rounded-xl backdrop-blur-sm'>
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className='text-3xl font-bold text-white mb-1'>Psychologist Verification Center</h1>
                                        <p className='text-teal-100'>Review and verify professional credentials</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Filter Section */}
                            <div className='px-8 py-6 border-b border-slate-200'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex space-x-1 bg-slate-100 p-1 rounded-xl'>
                                        <button
                                            onClick={() => handleFilterChange('pending')}
                                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                                filter === 'pending'
                                                    ? 'bg-white text-amber-700 shadow-md border border-amber-200'
                                                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                                            }`}
                                        >
                                            <span className='flex items-center space-x-2'>
                                                <div className={`w-2 h-2 rounded-full ${filter === 'pending' ? 'bg-amber-500' : 'bg-slate-400'}`}></div>
                                                <span>Pending Review</span>
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => handleFilterChange('rejected')}
                                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                                filter === 'rejected'
                                                    ? 'bg-white text-red-700 shadow-md border border-red-200'
                                                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                                            }`}
                                        >
                                            <span className='flex items-center space-x-2'>
                                                <div className={`w-2 h-2 rounded-full ${filter === 'rejected' ? 'bg-red-500' : 'bg-slate-400'}`}></div>
                                                <span>Rejected</span>
                                            </span>
                                        </button>
                                    </div>
                                    <div className='text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-lg'>
                                        <span className='font-medium'>{profiles.length}</span> {filter} profiles
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profiles Section */}
                        {profiles.length === 0 ? (
                            <div className='bg-white rounded-2xl shadow-xl border border-slate-200 p-12 text-center'>
                                <div className='w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center'>
                                    <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                                    </svg>
                                </div>
                                <h3 className='text-xl font-semibold text-slate-700 mb-2'>No {filter} profiles found</h3>
                                <p className='text-slate-500'>There are currently no psychologist profiles with {filter} status.</p>
                            </div>
                        ) : (
                            <div className='bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden'>
                                <div className='overflow-x-auto'>
                                    <table className='min-w-full'>
                                        <thead>
                                            <tr className='bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200'>
                                                <th className='px-8 py-4 text-left text-sm font-semibold text-slate-700'>Psychologist</th>
                                                <th className='px-6 py-4 text-left text-sm font-semibold text-slate-700'>Contact</th>
                                                <th className='px-6 py-4 text-left text-sm font-semibold text-slate-700'>Specialization</th>
                                                <th className='px-6 py-4 text-left text-sm font-semibold text-slate-700'>Status</th>
                                                <th className='px-6 py-4 text-left text-sm font-semibold text-slate-700'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className='divide-y divide-slate-200'>
                                            {profiles.map(profile => (
                                                <React.Fragment key={profile.user.id}>
                                                    <tr className='hover:bg-slate-50 transition-colors duration-150'>
                                                        <td className='px-8 py-6'>
                                                            <div className='flex items-center space-x-4'>
                                                                <div className='relative'>
                                                                    {profile.user.profile_image ? (
                                                                        <img
                                                                            src={profile.user.profile_image}
                                                                            alt='Profile'
                                                                            className='w-12 h-12 rounded-full border-2 border-slate-200 object-cover shadow-sm'
                                                                        />
                                                                    ) : (
                                                                        <div className='w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-sm'>
                                                                            {getInitials(profile.user.first_name, profile.user.last_name)}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h3 className='font-semibold text-slate-900'>
                                                                        {profile.user.first_name} {profile.user.last_name}
                                                                    </h3>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className='px-6 py-6'>
                                                            <div className='space-y-1'>
                                                                <p className='text-sm text-slate-900'>{profile.user.email}</p>
                                                                <p className='text-sm text-slate-500'>{profile.user.phone_number || 'Not provided'}</p>
                                                            </div>
                                                        </td>
                                                        <td className='px-6 py-6'>
                                                            <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'>
                                                                {profile.specialization || 'General'}
                                                            </span>
                                                        </td>
                                                        <td className='px-6 py-6'>
                                                            <span
                                                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                                                                    profile.is_verified === 'pending'
                                                                        ? 'bg-amber-100 text-amber-800'
                                                                        : profile.is_verified === 'rejected'
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : 'bg-green-100 text-green-800'
                                                                }`}
                                                            >
                                                                {profile.is_verified}
                                                            </span>
                                                        </td>
                                                        <td className='px-6 py-6'>
                                                            <button
                                                                onClick={() => toggleProfileDetails(profile.user.id)}
                                                                className='inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-600 text-white text-sm font-medium rounded-lg hover:from-teal-700 hover:to-teal-700 transition-all duration-200 shadow-sm hover:shadow-md'
                                                            >
                                                                {expandedProfileId === profile.user.id ? (
                                                                    <>
                                                                        <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 15l7-7 7 7'></path>
                                                                        </svg>
                                                                        Hide Details
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'></path>
                                                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'></path>
                                                                        </svg>
                                                                        View Details
                                                                    </>
                                                                )}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    {expandedProfileId === profile.user.id && (
                                                        <tr>
                                                            <td colSpan='5' className='px-0 py-0'>
                                                                <div className='bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-200'>
                                                                    <div className='p-8'>
                                                                        <div className='bg-white rounded-xl shadow-lg border border-slate-200 p-6'>
                                                                            {/* Profile Header */}
                                                                            <div className='flex items-start space-x-6 mb-8'>
                                                                                <div className='relative'>
                                                                                    {profile.user.profile_image ? (
                                                                                        <img
                                                                                            src={profile.user.profile_image}
                                                                                            alt='Profile'
                                                                                            className='w-24 h-24 rounded-xl border-4 border-white shadow-lg object-cover'
                                                                                        />
                                                                                    ) : (
                                                                                        <div className='w-24 h-24 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white'>
                                                                                            {getInitials(profile.user.first_name, profile.user.last_name)}
                                                                                        </div>
                                                                                    )}
                                                                                    <div className='absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white'></div>
                                                                                </div>
                                                                                <div className='flex-1'>
                                                                                    <h2 className='text-2xl font-bold text-slate-900 mb-2'>
                                                                                        {profile.user.first_name} {profile.user.last_name}
                                                                                    </h2>
                                                                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                                                                                        <div className='flex items-center space-x-2'>
                                                                                            <svg className='w-4 h-4 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'></path>
                                                                                            </svg>
                                                                                            <span className='text-slate-600'>{profile.user.email}</span>
                                                                                        </div>
                                                                                        <div className='flex items-center space-x-2'>
                                                                                            <svg className='w-4 h-4 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'></path>
                                                                                            </svg>
                                                                                            <span className='text-slate-600'>{profile.user.phone_number || 'Not provided'}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {/* Profile Details */}
                                                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                                                                                <div>
                                                                                    <h3 className='text-lg font-semibold text-slate-800 mb-4'>Professional Information</h3>
                                                                                    <div className='space-y-3 text-sm'>
                                                                                        <div className='flex items-center space-x-2'>
                                                                                            <svg className='w-4 h-4 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                                                                                            </svg>
                                                                                            <span className='text-slate-600'>
                                                                                                <strong>Specialization:</strong> {profile.specialization || 'Not provided'}
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className='flex items-center space-x-2'>
                                                                                            <svg className='w-4 h-4 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'></path>
                                                                                            </svg>
                                                                                            <span className='text-slate-600'>
                                                                                                <strong>License Number:</strong> {profile.license_no || 'Not provided'}
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className='flex items-center space-x-2'>
                                                                                            <svg className='w-4 h-4 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                                                                                            </svg>
                                                                                            <span className='text-slate-600'>
                                                                                                <strong>Experience:</strong> {profile.experience_years || 0} years
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className='flex items-center space-x-2'>
                                                                                            <svg className='w-4 h-4 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'></path>
                                                                                            </svg>
                                                                                            <span className='text-slate-600'>
                                                                                                <strong>Status:</strong> {profile.is_verified}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <h3 className='text-lg font-semibold text-slate-800 mb-4'>Certificates</h3>
                                                                                    <div className='space-y-3 text-sm'>
                                                                                        {profile.license_certificate ? (
                                                                                            <div className='flex items-center space-x-2'>
                                                                                                <svg className='w-4 h-4 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'></path>
                                                                                                </svg>
                                                                                                <a
                                                                                                    href={profile.license_certificate}
                                                                                                    target='_blank'
                                                                                                    rel='noopener noreferrer'
                                                                                                    className='text-teal-600 hover:underline'
                                                                                                >
                                                                                                    View License Certificate
                                                                                                </a>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <p className='text-slate-500'>No license certificate provided</p>
                                                                                        )}
                                                                                        {profile.experience_certificate ? (
                                                                                            <div className='flex items-center space-x-2'>
                                                                                                <svg className='w-4 h-4 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'></path>
                                                                                                </svg>
                                                                                                <a
                                                                                                    href={profile.experience_certificate}
                                                                                                    target='_blank'
                                                                                                    rel='noopener noreferrer'
                                                                                                    className='text-teal-600 hover:underline'
                                                                                                >
                                                                                                    View Experience Certificate
                                                                                                </a>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <p className='text-slate-500'>No experience certificate provided</p>
                                                                                        )}
                                                                                        {profile.education_certificate ? (
                                                                                            <div className='flex items-center space-x-2'>
                                                                                                <svg className='w-4 h-4 text-teal-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'></path>
                                                                                                </svg>
                                                                                                <a
                                                                                                    href={profile.education_certificate}
                                                                                                    target='_blank'
                                                                                                    rel='noopener noreferrer'
                                                                                                    className='text-teal-600 hover:underline'
                                                                                                >
                                                                                                    View Education Certificate
                                                                                                </a>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <p className='text-slate-500'>No education certificate provided</p>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {/* Action Buttons */}
                                                                            <div className='flex justify-end space-x-4 pt-6 border-t border-slate-200'>
                                                                                <button
                                                                                    onClick={() => handleVerification(profile.user.id, 'verify')}
                                                                                    className='inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
                                                                                >
                                                                                    <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'></path>
                                                                                    </svg>
                                                                                    Verify & Approve
                                                                                </button>
                                                                                {filter === 'verify'?(

                                                                                  <button
                                                                                  onClick={() => handleVerification(profile.user.id, 'reject')}
                                                                                  className='inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
                                                                                  >
                                                                                    <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
                                                                                    </svg>
                                                                                    Reject Application
                                                                                </button>
                                                                                ):(
                                                                                  <button
                                                                                  onClick={()=>setExpandedProfileId(null)}
                                                                                  className='inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5'>
                                                                                    Cancel</button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {totalPages > 0 &&(
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default PsychologistVerification