import React, { useEffect, useState } from 'react'
import { AdminAppointmentsApi } from '../../api/appointmentApi'
import ErrorHandler from '../../Components/Layouts/ErrorHandler'
import Loading from '../../Components/Layouts/Loading';
import AdminSidebar from '../../Components/Admin/AdminSidebar';
import AdminHeader from '../../Components/Admin/AdminHeader';
import { Calendar, Clock } from 'lucide-react';
import Pagination from '../../Components/Layouts/Pagination';

const ViewAppointments = () => {
    const [isLoading,setIsLoading] = useState(false)
    const [appointments,setAppointments] = useState([])
    const [statusFilter,setStatusFilter] = useState('booked')
    const [currentPage,setCurrentPage] = useState(1)
    const [totalPages,setTotalPages] = useState(1)
    const page_size = 6

    const FetchAppointments = async(page=1) =>{
        setIsLoading(true)
        try{
            const data = await AdminAppointmentsApi(page,statusFilter)
            setAppointments(data.results)
            setTotalPages(Math.ceil(data.count / page_size))
        }catch(error){
            ErrorHandler(error)
        }finally{
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        FetchAppointments(currentPage)
    },[currentPage,statusFilter])

    const handlePageChange = (pageNum) =>{
        if(pageNum > 0 && pageNum <= totalPages){
            setCurrentPage(pageNum)
        }
    }

    return (
        <Loading isLoading={isLoading}>
        <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-16'>
            <AdminHeader />
            <div className='ml-0 lg:ml-64 transition-all duration-300'>
            <AdminSidebar />
                <div className='p-6 sm:p-6 md:p-8 lg:p-10'>
                    <div className='max-w-7xl mx-auto'>
                        {/* Header Section */}
                        <div className='bg-white rounded-2xl shadow-xl border border-slate-200 mb-8 overflow-hidden'>
                            <div className='bg-gradient-to-r from-teal-600 via-teal-600 to-teal-800 px-8 py-6'>
                                <div className='flex items-center space-x-4'>
                                    <div className='p-3 bg-white/20 rounded-xl backdrop-blur-sm'>
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className='text-3xl font-bold text-white mb-1'>Appointments Dashboard</h1>
                                        <p className='text-teal-100'>Manage and monitor all scheduled appointments</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Filter Section */}
                            <div className='px-8 py-6 border-b border-slate-200'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex space-x-1 bg-slate-100 p-1 rounded-xl'>
                                        <button
                                            onClick={() => setStatusFilter('booked')}
                                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                                statusFilter === 'booked'
                                                    ? 'bg-white text-yellow-700 shadow-md border border-yellow-200'
                                                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                                            }`}
                                        >
                                            <span className='flex items-center space-x-2'>
                                                <div className={`w-2 h-2 rounded-full ${statusFilter === 'booked' ? 'bg-yellow-500' : 'bg-slate-400'}`}></div>
                                                <span>Booked</span>
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => setStatusFilter('completed')}
                                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                                statusFilter === 'completed'
                                                    ? 'bg-white text-green-700 shadow-md border border-green-200'
                                                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                                            }`}
                                        >
                                            <span className='flex items-center space-x-2'>
                                                <div className={`w-2 h-2 rounded-full ${statusFilter === 'completed' ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                                                <span>Completed</span>
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => setStatusFilter('cancelled')}
                                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                                statusFilter === 'cancelled'
                                                    ? 'bg-white text-red-700 shadow-md border border-red-200'
                                                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                                            }`}
                                        >
                                            <span className='flex items-center space-x-2'>
                                                <div className={`w-2 h-2 rounded-full ${statusFilter === 'cancelled' ? 'bg-red-500' : 'bg-slate-400'}`}></div>
                                                <span>Cancelled</span>
                                            </span>
                                        </button>
                                    </div>
                                    <div className='text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-lg'>
                                        <span className='font-medium'>{appointments.length}</span> {statusFilter} appointments
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Appointments Section */}
                        {appointments.length > 0 ? (
                            <div className='bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden'>
                                <div className='overflow-x-auto'>
                                    <table className='min-w-full'>
                                        <thead>
                                            <tr className='bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200'>
                                                <th className='px-8 py-4 text-left text-sm font-semibold text-slate-700'>User</th>
                                                <th className='px-8 py-4 text-left text-sm font-semibold text-slate-700'>Psychologist</th>
                                                <th className='px-6 py-4 text-left text-sm font-semibold text-slate-700'>Date</th>
                                                <th className='px-6 py-4 text-left text-sm font-semibold text-slate-700'>Time</th>
                                                <th className='px-6 py-4 text-left text-sm font-semibold text-slate-700'>Amount</th>
                                                <th className='px-6 py-4 text-left text-sm font-semibold text-slate-700'>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className='divide-y divide-slate-200'>
                                            {appointments.map((appointment) => (
                                                <tr key={appointment.id} className='hover:bg-slate-50 transition-colors duration-150'>
                                                    <td className='px-8 py-6'>
                                                        <div className='flex items-center space-x-4'>
                                                            <div className='relative'>
                                                                <div className='w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-sm'>
                                                                    {appointment.user_name?.charAt(0) || 'U'}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h3 className='font-semibold text-slate-900'>{appointment.user_name}</h3>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='px-8 py-6'>
                                                        <div className='flex items-center space-x-4'>
                                                            <div className='relative'>
                                                                <div className='w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-sm'>
                                                                    {appointment.psychologist_name?.charAt(0) || 'U'}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h3 className='font-semibold text-slate-900'>{appointment.psychologist_name}</h3>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='px-6 py-6'>
                                                        <div className='flex items-center space-x-2'>
                                                            <Calendar className='h-5 w-5 text-teal-500' />
                                                            <span className='text-sm text-slate-600'>{new Date(appointment.slot_date).toLocaleDateString()}</span>
                                                        </div>
                                                    </td>
                                                    <td className='px-6 py-6'>
                                                        <div className='flex items-center space-x-2'>
                                                            <Clock className='h-5 w-5 text-teal-500' />
                                                            <span className='text-sm text-slate-600'>{new Date(`1970-01-01T${appointment.slot_time}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </td>
                                                    <td className='px-6 py-6'>
                                                        <span className='text-sm font-medium text-slate-900'>   {appointment.payment_amount || '0.00'}</span>
                                                    </td>
                                                    <td className='px-6 py-6'>
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                                                            appointment.status === 'booked' ? 'bg-yellow-100 text-yellow-800' :
                                                            appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {appointment.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {totalPages > 1 &&(
                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
                                )}
                            </div>
                        ) : (
                            <div className='bg-white rounded-2xl shadow-xl border border-slate-200 p-12 text-center'>
                                <div className='w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center'>
                                    <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                                    </svg>
                                </div>
                                <h3 className='text-xl font-semibold text-slate-700 mb-2'>No {statusFilter} appointments found</h3>
                                <p className='text-slate-500'>There are currently no appointments with {statusFilter} status.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </Loading>
    );
};

export default ViewAppointments