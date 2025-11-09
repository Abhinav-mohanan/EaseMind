import React, { useEffect, useState } from 'react';
import { UserAppointmentsApi } from '../../../api/appointmentApi';
import ErrorHandler from '../../../Components/Layouts/ErrorHandler';
import Loading from '../../../Components/Layouts/Loading';
import Navbar from '../../../Components/Users/Common/Navbar';
import { Calendar, Clock, User } from 'lucide-react';
import Pagination from '../../../Components/Layouts/Pagination';
import UserSidebar from '../../../Components/Users/User/UserSidebar';
import { useNavigate } from 'react-router-dom';

const UserAppointments = () => {
    const navigate = useNavigate()
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('booked');
    const page_size = 6;

    const FetchAppointments = async (page = 1) => {
        setIsLoading(true);
        try {
            const data = await UserAppointmentsApi(page, statusFilter);
            setAppointments(data.results);
            setTotalPages(Math.ceil(data.count / page_size));
        } catch (error) {
            ErrorHandler(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        FetchAppointments(currentPage);
    }, [currentPage, statusFilter]);

    const handlePageChange = (pageNum) => {
        if (pageNum > 0 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        }
    };

    return (
        <Loading isLoading={isLoading}>
            <div className="min-h-screen bg-gray-50 pt-16"> 
                    <Navbar />
                <div className="ml-0 lg:ml-64 transition-all duration-300">
                <UserSidebar />
                    <div className="p-4 sm:p-6 md:p-8 lg:p-10"> 
                        <div className="max-w-7xl mx-auto"> 
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">Your Appointments</h2> 
                            <div className="mb-6 flex flex-wrap gap-3">
                                {['booked', 'completed', 'cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out
                                            ${statusFilter === status
                                                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md hover:from-teal-600 hover:to-teal-700' 
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400' 
                                            }`}
                                        onClick={() => setStatusFilter(status)}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                            {appointments.length > 0 ? (
                                <div className="bg-white shadow-xl rounded-xl overflow-hidden ring-1 ring-gray-200">  
                                    <table className="min-w-full divide-y divide-gray-200"> 
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Psychologist</th> 
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100"> 
                                            {appointments.map((appointment) => (
                                                <tr key={appointment.id} className="hover:bg-teal-50 hover:bg-opacity-20 transition-colors duration-150 ease-in-out"> 
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <User className="h-5 w-5 text-teal-600 mr-2" /> 
                                                            <span className="text-sm font-medium text-gray-900">{appointment.psychologist_name}</span> 
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <Calendar className="h-5 w-5 text-teal-600 mr-2" />
                                                            <span className="text-sm text-gray-800">{new Date(appointment.slot_date).toLocaleDateString()}</span> 
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <Clock className="h-5 w-5 text-teal-600 mr-2" />
                                                            <span className="text-sm text-gray-800">{appointment.slot_time}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-sm font-semibold text-gray-900">₹{appointment.payment_amount}</span> 
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full
                                                                ${appointment.status === 'booked'
                                                                    ? 'bg-yellow-100 text-yellow-700'
                                                                    : appointment.status === 'completed'
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : 'bg-red-100 text-red-700'
                                                                }`}
                                                        >
                                                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)} 
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={()=>navigate(`/user/appointment/${appointment.id}`)}
                                                            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 
                                                            focus:ring-teal-500 focus:ring-opacity-50 transition-all duration-200 ease-in-out"
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white shadow-lg rounded-xl flex flex-col items-center justify-center"> 
                                    <Calendar className="h-20 w-20 text-gray-300 mx-auto mb-6" /> 
                                    <p className="text-gray-700 text-xl font-medium mb-2">No {statusFilter} appointments.</p> 
                                    <p className="text-gray-500 text-base">Check back later for new bookings or adjust your filter.</p> 
                                </div>
                            )}
                            {totalPages > 1 && (
                                <div className="mt-8 flex justify-center"> 
                                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Loading>
    );
};

export default UserAppointments;