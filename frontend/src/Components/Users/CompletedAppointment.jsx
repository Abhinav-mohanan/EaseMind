import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ErrorHandler from '../Layouts/ErrorHandler'
import Loading from '../Layouts/Loading';
import { Calendar, Clock, User, FileText, ArrowRight, CheckCircle } from 'lucide-react';
import Pagination from '../Layouts/Pagination';

const CompletedAppointmentList = ({role, fetchApi}) => {
    const navigate = useNavigate()
    const [appointments, setAppointments] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [totalPages,setTotalPages] = useState(1)
    const [currentPage,setCurrentPage] = useState(1)
    const page_size = 6

    const completedAppointments = async() => {
        setIsLoading(true)
        try{
            const data = await fetchApi()
            setAppointments(data.results)
            setTotalPages(Math.ceil(data.count / page_size))
        }catch(error){
            ErrorHandler(error)
        }finally{
            setIsLoading(false)
        }
    }

    useEffect(() => {
        completedAppointments()
    }, [])

    const handlePageChange=(pageNum) =>{
        if(pageNum > 0 && pageNum <= totalPages){
            setCurrentPage(pageNum)
        }
    }

    const getDisplayName = (appt) => {
        return role === 'psychologist' ? appt.user_name : appt.psychologist_name;
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { 
            weekday: 'short',
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
    }

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A'
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

    const getActionText = () => {
        return role === "psychologist" 
            ? "Manage Prescription" 
            : "View Session Details"
    }

    const getSubtitleText = () => {
        return role === "psychologist"
            ? "Click to view patient details and manage prescription"
            : "Click to view your completed session information"
    }

    return (
        <Loading isLoading={isLoading}>
            <div className="flex-1 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <div className="bg-green-100 p-2 rounded-lg mr-3">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Completed Sessions</h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    {role === 'psychologist' 
                                        ? 'Review completed appointments and manage prescriptions'
                                        : 'Access your completed therapy sessions and prescriptions'
                                    }
                                </p>
                            </div>
                        </div>
                        
                        {appointments.length > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-700">
                                    <span className="font-medium">{appointments.length}</span> completed session{appointments.length !== 1 ? 's' : ''} found
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Appointments List */}
                    {appointments.length > 0 ? (
                        <div className="space-y-4">
                            {appointments.map((appt, index) => (
                                <div
                                    key={appt.id}
                                    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden"
                                    onClick={() => navigate(`/${role}/prescription/${appt.id}`)}
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                {/* Avatar */}
                                                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl">
                                                    <User className="h-6 w-6 text-blue-600" />
                                                </div>

                                                {/* Main Info */}
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {getDisplayName(appt)}
                                                        </h3>
                                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                                            Completed
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                                                        <div className="flex items-center space-x-1">
                                                            <Calendar className="h-4 w-4 text-gray-400" />
                                                            <span>{formatDate(appt.slot_date)}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <Clock className="h-4 w-4 text-gray-400" />
                                                            <span>{formatTime(appt.slot_time)}</span>
                                                        </div>
                                                        {role === 'psychologist' && (
                                                            <div className="flex items-center space-x-1">
                                                                <FileText className="h-4 w-4 text-gray-400" />
                                                                <span>Session #{appt.id}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Section */}
                                            <div className="flex items-center space-x-4">
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                                        {getActionText()}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {getSubtitleText()}
                                                    </p>
                                                </div>
                                                
                                                <div className="bg-gray-50 group-hover:bg-blue-50 p-3 rounded-xl transition-colors">
                                                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-1 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                    {/* Bottom Border with Gradient */}
                                </div>
                            ))}
                            {totalPages > 1 &&(
                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
                            )}
                        </div>
                    ) : (
                        // Empty State
                        <div className="text-center py-16">
                            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No Completed Sessions</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                {role === 'psychologist' 
                                    ? 'You haven\'t completed any appointments yet. Completed sessions will appear here.'
                                    : 'You don\'t have any completed therapy sessions yet. Your finished sessions will appear here.'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Loading>
    );
};

export default CompletedAppointmentList