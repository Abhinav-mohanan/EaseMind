import React, { useEffect, useState } from 'react'
import { PsychologistAppointmentApi } from '../../../api/appointmentApi'
import ErrorHandler from '../../../Components/Layouts/ErrorHandler'
import Loading from '../../../Components/Layouts/Loading';
import Navbar from '../../../Components/Users/Navbar';
import PsychologistSidebar from '../../../Components/Users/Psychologist/PsychologistSidebar';
import { Calendar, Clock, User } from 'lucide-react';
import Pagination from '../../../Components/Layouts/Pagination';

const PsychologistAppointments = () => {
    const [appointments,setAppointments] = useState([])
    const [currentPage,setCurrentPage] = useState(1)
    const [totalPages,setTotalPages] = useState(1)
    const [statusFilter,setStatusFilter] = useState('booked')
    const [isLoading,setIsLoading] = useState(false)
    const page_size = 6

    const FetchAppointments = async(page=1) =>{
        setIsLoading(true)
        try{
            const data = await PsychologistAppointmentApi(page,statusFilter)
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

    const handlePageChange =(pageNum) =>{
        if(pageNum > 0 && pageNum <=totalPages){
            setCurrentPage(pageNum)
        }
    }

    return (
        <Loading isLoading={isLoading}>
        <div className='min-h-screen bg-gray-50'>
            <PsychologistSidebar />
            <div className='ml-0 lg:ml-64 transition-all duration-300'>
            <Navbar />
                <div className='flex-1 p-8'>
                    <div className='max-w-6xl mx-auto'>
                        <h2 className='text-3xl font-bold text-gray-800 mb-6'>Appointments</h2>
                        <div className="mb-4 flex flex-wrap gap-2">
                        {['booked', 'completed', 'cancelled'].map((status) => (
                            <button
                            key={status}
                            className={`px-4 py-2 rounded-full text-sm font-medium border ${
                                statusFilter === status
                                ? 'bg-teal-500 text-white border-teal-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                            }`}
                            onClick={()=>setStatusFilter(status)}
                            >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                        </div>
                        {appointments.length > 0 ? (
                            <div className='bg-white shadow-lg rounded-xl overflow-hidden'>
                                <table className='w-full'>
                                    <thead className='bg-gray-50'>
                                        <tr>
                                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>User</th>
                                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Date</th>
                                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Time</th>
                                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Amount</th>
                                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-gray-200'>
                                        {appointments.map((appointment) => (
                                            <tr key={appointment.id} className='hover:bg-gray-50'>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <div className='flex items-center'>
                                                        <User className='h-5 w-5 text-teal-500 mr-2' />
                                                        <span className='text-sm text-gray-900'>{appointment.user_name}</span>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <div className='flex items-center'>
                                                        <Calendar className='h-5 w-5 text-teal-500 mr-2' />
                                                        <span className='text-sm text-gray-900'>{new Date(appointment.slot_date).toLocaleDateString()}</span>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <div className='flex items-center'>
                                                        <Clock className='h-5 w-5 text-teal-500 mr-2' />
                                                        <span className='text-sm text-gray-900'>{appointment.slot_time}</span>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <div className='flex items-center'>
                                                        <span className='text-sm text-gray-900'>{appointment.payment_amount}</span>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                        ) : (
                            <div className='text-center py-12 bg-white shadow-lg rounded-xl'>
                                <Calendar className='h-16 w-16 text-gray-300 mx-auto mb-4' />
                                <p className='text-gray-600 text-lg'>No {statusFilter} appointments .</p>
                                <p className='text-gray-500 text-sm'>Check back later for new bookings.</p>
                            </div>
                        )}
                    </div>
                    {totalPages > 1 &&(
                     <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
                    )}
                </div>
            </div>
        </div>
        </Loading>
    );
};

export default PsychologistAppointments