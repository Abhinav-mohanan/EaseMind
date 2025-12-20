import React, { useEffect, useState } from 'react'
import Loading from '../../Components/Layouts/Loading'
import { fetchRevenueDetails } from '../../api/adminApi'
import ErrorHandler from '../../Components/Layouts/ErrorHandler'
import AdminHeader from '../../Components/Admin/AdminHeader'
import AdminSidebar from '../../Components/Admin/AdminSidebar'
import Breadcrumbs from '../../Components/Layouts/Breadcrumbs'
import { TrendingUp, Calendar, User, UserCheck, Clock, IndianRupee, Wallet } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import Pagination from '../../Components/Layouts/Pagination'

const RevenueDetails = () => {
    const location = useLocation()
    const { totalRevenue, totalAppointmentAmount } = location.state || {} 
    const [details, setDetails] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [totalPages,setTotalpage] = useState(1)
    const [currentPage,setCurrentPage] = useState(1)
    const page_size = 6
    
    const fetchDetails = async(page=currentPage) => {
        try {
            setIsLoading(true)
            const data = await fetchRevenueDetails(page)
            setTotalpage(Math.ceil(data.count / page_size))
            setDetails(data.results)
        } catch(error) {
            ErrorHandler(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDetails()
    }, [currentPage])

    const handlepageChange = (pageNum) =>{
        if (pageNum > 0 && pageNum <= totalPages){
            setCurrentPage(pageNum)
        }
    }

    const breadcrumb_items = [
        {label:'Dashboard', link:'/admin/dashboard'},
        {label:'RevenueDetails', link:null}
    ]

    return (
        <Loading isLoading={isLoading}>
            <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-16'>
                <AdminHeader/>
                <div className='ml-0 lg:ml-64 transition-all duration-300'>
                    <AdminSidebar/>
                    <div className="p-6 sm:p-6 md:p-8 lg:p-10">
                        <div className="max-w-7xl mx-auto">
                            <Breadcrumbs items={breadcrumb_items}/>
                            
                            <div className='bg-white rounded-2xl shadow-xl border border-slate-200 mb-8 overflow-hidden'>
                                <div className='bg-gradient-to-r from-teal-600 via-teal-600 to-teal-800 px-8 py-6'>
                                    <div className='flex items-center justify-between flex-wrap gap-4'>
                                        <div className='flex items-center space-x-4'>
                                            <div className='p-3 bg-white/20 rounded-xl backdrop-blur-sm'>
                                                <TrendingUp className='w-8 h-8 text-white' />
                                            </div>
                                            <div>
                                                <h1 className='text-3xl font-bold text-white mb-1'>Revenue Details</h1>
                                                <p className='text-teal-100'>Complete transaction history and insights</p>
                                            </div>
                                        </div>
                                        <div className='flex gap-4'>
                                            <div className='bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/30'>
                                                <div className='text-teal-100 text-sm font-medium mb-1'>Platform Revenue</div>
                                                <div className='text-2xl font-bold text-white flex items-center'>
                                                    <Wallet className='w-5 h-5 mr-1' />
                                                    {totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                                </div>
                                            </div>
                                            <div className='bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/30'>
                                                <div className='text-teal-100 text-sm font-medium mb-1'>Total Appointments</div>
                                                <div className='text-2xl font-bold text-white flex items-center'>
                                                    <IndianRupee className='w-5 h-5 mr-1' />
                                                    {totalAppointmentAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='px-8 py-4 bg-slate-50 border-b border-slate-200'>
                                    <div className='text-sm text-slate-600'>
                                        <span className='font-semibold text-teal-700'>{details.length}</span> total transactions
                                    </div>
                                </div>
                            </div>

                            {details.length > 0 ? (
                                <div className='bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden'>
                                    <div className='hidden lg:block overflow-x-auto'>
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-teal-200">
                                                    <th className="px-6 py-4 text-left">
                                                        <div className='flex items-center space-x-2 text-slate-700 font-semibold'>
                                                            <Calendar className='w-4 h-4 text-teal-600' />
                                                            <span>Appointment Date</span>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-left">
                                                        <div className='flex items-center space-x-2 text-slate-700 font-semibold'>
                                                            <Clock className='w-4 h-4 text-teal-600' />
                                                            <span>Time Slot</span>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-left">
                                                        <div className='flex items-center space-x-2 text-slate-700 font-semibold'>
                                                            <User className='w-4 h-4 text-teal-600' />
                                                            <span>Client</span>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-left">
                                                        <div className='flex items-center space-x-2 text-slate-700 font-semibold'>
                                                            <UserCheck className='w-4 h-4 text-teal-600' />
                                                            <span>Psychologist</span>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-left">
                                                        <div className='flex items-center space-x-2 text-slate-700 font-semibold'>
                                                            <IndianRupee className='w-4 h-4 text-teal-600' />
                                                            <span>Appointment Fee</span>
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-left">
                                                        <div className='flex items-center space-x-2 text-slate-700 font-semibold'>
                                                            <Wallet className='w-4 h-4 text-teal-600' />
                                                            <span>Platform Revenue</span>
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {details.map((item, index) => (
                                                    <tr 
                                                        key={item.id} 
                                                        className="border-b border-slate-100 hover:bg-teal-50/50 transition-colors duration-150"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className='flex items-center space-x-2'>
                                                                <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center'>
                                                                    <Calendar className='w-5 h-5 text-teal-700' />
                                                                </div>
                                                                <div>
                                                                    <div className='font-medium text-slate-800'>
                                                                        {item.appointment_date ? new Date(item.appointment_date).toLocaleDateString('en-IN', { 
                                                                            day: '2-digit', 
                                                                            month: 'short', 
                                                                            year: 'numeric' 
                                                                        }) : 'N/A'}
                                                                    </div>
                                                                    <div className='text-xs text-slate-500'>
                                                                        {new Date(item.created_at).toLocaleTimeString('en-IN', { 
                                                                            hour: '2-digit', 
                                                                            minute: '2-digit' 
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className='flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'>
                                                                <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center'>
                                                                <Clock className='w-4 h-4 text-blue-700 mr-2' />
                                                                </div>
                                                                <span className='font-medium text-blue-700 text-sm'>
                                                                    {item.appointment_time || 'N/A'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className='flex items-center space-x-2'>
                                                                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center'>
                                                                    <span className='text-blue-700 font-semibold text-sm'>
                                                                        {item.client ? item.client.charAt(0).toUpperCase() : 'N'}
                                                                    </span>
                                                                </div>
                                                                <span className='text-slate-700 font-medium'>{item.client || 'N/A'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className='flex items-center space-x-2'>
                                                                <div className='w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center'>
                                                                    <span className='text-purple-700 font-semibold text-sm'>
                                                                        {item.psychologist ? item.psychologist.charAt(0).toUpperCase() : 'N'}
                                                                    </span>
                                                                </div>
                                                                <span className='text-slate-700 font-medium'>{item.psychologist || 'N/A'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className='inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200'>
                                                                <IndianRupee className='w-4 h-4 text-amber-700 mr-1' />
                                                                <span className='font-bold text-amber-700'>
                                                                    {item.appointment_amount ? parseFloat(item.appointment_amount).toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '0.00'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className='inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'>
                                                                <Wallet className='w-4 h-4 text-green-700 mr-1' />
                                                                <span className='font-bold text-green-700'>
                                                                    {parseFloat(item.amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                
                                    <div className='lg:hidden divide-y divide-slate-200'>
                                        {details.map((item) => (
                                            <div key={item.id} className='p-5 hover:bg-teal-50/30 transition-colors duration-150'>
                                                <div className='flex items-center justify-between mb-4'>
                                                    <div className='flex items-center space-x-3'>
                                                        <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center'>
                                                            <Calendar className='w-6 h-6 text-teal-700' />
                                                        </div>
                                                        <div>
                                                            <div className='font-semibold text-slate-800'>
                                                                {item.appointment_date ? new Date(item.appointment_date).toLocaleDateString('en-IN', { 
                                                                    day: '2-digit', 
                                                                    month: 'short', 
                                                                    year: 'numeric' 
                                                                }) : 'N/A'}
                                                            </div>
                                                            <div className='text-xs text-slate-500'>
                                                                {new Date(item.created_at).toLocaleTimeString('en-IN', { 
                                                                    hour: '2-digit', 
                                                                    minute: '2-digit' 
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className='space-y-3'>
                                                    <div className='flex items-center justify-between'>
                                                        <div className='flex items-center space-x-2'>
                                                            <Clock className='w-4 h-4 text-blue-600' />
                                                            <span className='text-xs text-slate-600 font-medium'>Time:</span>
                                                        </div>
                                                        <span className='text-sm text-slate-800 font-medium bg-blue-50 px-2 py-1 rounded'>{item.appointment_time || 'N/A'}</span>
                                                    </div>
                                                    <div className='flex items-center justify-between'>
                                                        <div className='flex items-center space-x-2'>
                                                            <User className='w-4 h-4 text-blue-600' />
                                                            <span className='text-xs text-slate-600 font-medium'>Client:</span>
                                                        </div>
                                                        <span className='text-sm text-slate-800 font-medium'>{item.client || 'N/A'}</span>
                                                    </div>
                                                    <div className='flex items-center justify-between'>
                                                        <div className='flex items-center space-x-2'>
                                                            <UserCheck className='w-4 h-4 text-purple-600' />
                                                            <span className='text-xs text-slate-600 font-medium'>Psychologist:</span>
                                                        </div>
                                                        <span className='text-sm text-slate-800 font-medium'>{item.psychologist || 'N/A'}</span>
                                                    </div>
                                                    <div className='pt-3 border-t border-slate-200 space-y-2'>
                                                        <div className='flex items-center justify-between'>
                                                            <span className='text-xs text-slate-600 font-medium'>Appointment Fee:</span>
                                                            <div className='flex items-center px-2 py-1 rounded bg-amber-50'>
                                                                <IndianRupee className='w-3 h-3 text-amber-700 mr-1' />
                                                                <span className='font-bold text-amber-700 text-sm'>
                                                                    {item.appointment_amount ? parseFloat(item.appointment_amount).toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '0.00'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className='flex items-center justify-between'>
                                                            <span className='text-xs text-slate-600 font-medium'>Platform Revenue:</span>
                                                            <div className='flex items-center px-2 py-1 rounded bg-green-50'>
                                                                <Wallet className='w-3 h-3 text-green-700 mr-1' />
                                                                <span className='font-bold text-green-700 text-sm'>
                                                                    {parseFloat(item.amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {totalPages > 1 &&(
                                        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlepageChange}/>
                                    )}

                                </div>
                            ) : (
                                <div className='bg-white rounded-2xl shadow-xl border border-slate-200 p-12 text-center'>
                                    <div className='w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center'>
                                        <TrendingUp className='w-12 h-12 text-slate-400' />
                                    </div>
                                    <h3 className='text-xl font-semibold text-slate-700 mb-2'>
                                        No revenue data found
                                    </h3>
                                    <p className='text-slate-500'>
                                        There are currently no transactions to display.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Loading>
    )
}

export default RevenueDetails