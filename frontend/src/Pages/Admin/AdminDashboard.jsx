import React, { useEffect, useState } from 'react'
import { AdminDashboardApi } from '../../api/DashboardApi'
import ErrorHandler from '../../Components/Layouts/ErrorHandler'
import Loading from '../../Components/Layouts/Loading'
import AdminSidebar from '../../Components/Admin/AdminSidebar'
import AdminHeader from '../../Components/Admin/AdminHeader'
import { Users, User, CheckCircle, XCircle, DollarSign, Calendar, PieChart, IndianRupee, TrendingUp, Activity } from 'lucide-react'
import { Pie } from 'react-chartjs-2'
import 'chart.js/auto'

const AdminDashboard = () => {
    const [isLoading,setIsLoading] = useState(false)
    const [dashboardData,setDashboardData] = useState(null)

    const fetchDashboard = async() =>{
        try{
            setIsLoading(true)
            const data = await AdminDashboardApi()
            setDashboardData(data)
        }catch(error){
            ErrorHandler(error)
        }finally{
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        fetchDashboard()
    },[])

    if(!dashboardData) return null

    const { stats, appointment_stats } = dashboardData

    const pieData = {
        labels: appointment_stats.map(item=>item.status),
        datasets:[{
            data: appointment_stats.map(item=>item.count),
            backgroundColor: [
                '#10B981', 
                '#3B82F6',  
                '#EF4444', 
                '#F59E0B', 
                '#8B5CF6'  
            ],
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverBorderWidth: 3
        }]
    }

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: {
                        size: 12
                    }
                }
            }
        }
    }

    return (
        <Loading isLoading={isLoading}>
            <div className='flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
                <AdminSidebar/>
                <div className='flex-1 ml-64'>
                    <AdminHeader/>
                    <main className='p-8'>
                        <div className='mb-10'>
                            <div className='flex items-center gap-4 mb-3'>
                                <div className='p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg'>
                                    <Activity className='h-8 w-8 text-white'/>
                                </div>
                                <div>
                                    <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
                                        Admin Dashboard
                                    </h1>
                                    <p className='text-gray-600 text-lg'>Comprehensive overview of platform analytics</p>
                                </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8'>
                            {/* Total Users */}
                            <div className='group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
                                <div className='flex items-center justify-between mb-4'>
                                    <div className='p-3 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-xl shadow-md group-hover:scale-110 transition-transform'>
                                        <User className='h-6 w-6 text-white'/>
                                    </div>
                                    <TrendingUp className='h-5 w-5 text-emerald-500' />
                                </div>
                                <div>
                                    <p className='text-gray-600 text-sm font-medium mb-1'>Total Users</p>
                                    <p className='text-3xl font-bold text-gray-800'>{stats.total_users}</p>
                                </div>
                            </div>

                            {/* Total Psychologists */}
                            <div className='group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
                                <div className='flex items-center justify-between mb-4'>
                                    <div className='p-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl shadow-md group-hover:scale-110 transition-transform'>
                                        <Users className='h-6 w-6 text-white'/>
                                    </div>
                                    <TrendingUp className='h-5 w-5 text-blue-500' />
                                </div>
                                <div>
                                    <p className='text-gray-600 text-sm font-medium mb-1'>Total Psychologists</p>
                                    <p className='text-3xl font-bold text-gray-800'>{stats.total_psychologists}</p>
                                </div>
                            </div>

                            {/* Total Appointments */}
                            <div className='group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
                                <div className='flex items-center justify-between mb-4'>
                                    <div className='p-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl shadow-md group-hover:scale-110 transition-transform'>
                                        <Calendar className='h-6 w-6 text-white'/>
                                    </div>
                                    <TrendingUp className='h-5 w-5 text-purple-500' />
                                </div>
                                <div>
                                    <p className='text-gray-600 text-sm font-medium mb-1'>Total Appointments</p>
                                    <p className='text-3xl font-bold text-gray-800'>{stats.total_appointments}</p>
                                </div>
                            </div>

                            {/* Total Revenue */}
                            <div className='group bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
                                <div className='flex items-center justify-between mb-4'>
                                    <div className='p-3 bg-gradient-to-r from-green-400 to-green-600 rounded-xl shadow-md group-hover:scale-110 transition-transform'>
                                        <IndianRupee className='h-6 w-6 text-white'/>
                                    </div>
                                    <TrendingUp className='h-5 w-5 text-green-500' />
                                </div>
                                <div>
                                    <p className='text-gray-600 text-sm font-medium mb-1'>Total Revenue</p>
                                    <p className='text-3xl font-bold text-gray-800'>₹{stats.total_revenue}</p>
                                </div>
                            </div>
                        </div>

                        {/* Charts and Details Section */}
                        <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
                            <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 hover:shadow-xl transition-shadow'>
                                <div className='flex items-center gap-3 mb-6'>
                                    <div className='p-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl'>
                                        <PieChart className='h-5 w-5 text-white'/>
                                    </div>
                                    <h2 className='text-xl font-bold text-gray-800'>Appointment Status Overview</h2>
                                </div>
                                <div className='h-80'>
                                    <Pie data={pieData} options={pieOptions}/>
                                </div>
                            </div>

                            <div className='bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 hover:shadow-xl transition-shadow'>
                                <div className='flex items-center gap-3 mb-6'>
                                    <div className='p-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl'>
                                        <Activity className='h-5 w-5 text-white'/>
                                    </div>
                                    <h2 className='text-xl font-bold text-gray-800'>Detailed Analytics</h2>
                                </div>
                                
                                <div className='space-y-6'>
                                    <div className='flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100'>
                                        <div className='flex items-center gap-3'>
                                            <CheckCircle className='h-5 w-5 text-green-600' />
                                            <span className='font-medium text-gray-700'>Completed Appointments</span>
                                        </div>
                                        <span className='text-xl font-bold text-green-600'>{stats.total_completed_appointments}</span>
                                    </div>

                                    <div className='flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-100'>
                                        <div className='flex items-center gap-3'>
                                            <XCircle className='h-5 w-5 text-red-600' />
                                            <span className='font-medium text-gray-700'>Cancelled Appointments</span>
                                        </div>
                                        <span className='text-xl font-bold text-red-600'>{stats.total_cancelled_appointments}</span>
                                    </div>

                                    <div className='flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-100'>
                                        <div className='flex items-center gap-3'>
                                            <DollarSign className='h-5 w-5 text-amber-600' />
                                            <span className='font-medium text-gray-700'>Pending Payments</span>
                                        </div>
                                        <span className='text-xl font-bold text-amber-600'>₹{stats.total_pending_payments}</span>
                                    </div>

                                    <div className='flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100'>
                                        <div className='flex items-center gap-3'>
                                            <IndianRupee className='h-5 w-5 text-blue-600' />
                                            <span className='font-medium text-gray-700'>Total Appointment Value</span>
                                        </div>
                                        <span className='text-xl font-bold text-blue-600'>₹{stats.total_appointment_amount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </Loading>
    )
}

export default AdminDashboard