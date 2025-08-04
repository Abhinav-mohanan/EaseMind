import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { UserAppointmentDetailsApi } from '../../../api/appointmentApi'
import ErrorHandler from '../../../Components/Layouts/ErrorHandler'
import { AlertTriangle, Calendar, CheckCircle, Clock, Heart, IndianRupee, Mail, MapPin, 
    MessageCircle, Phone,Video, XCircle } from 'lucide-react';
import Loading from '../../../Components/Layouts/Loading';
import UserSidebar from '../../../Components/Users/User/UserSidebar';
import Navbar from '../../../Components/Users/Navbar';
import default_img from '../../../assets/default_image.png'

const UserAppointmentDetails = () => {
    const {appointment_id} = useParams()
    const [appointment,setAppointment] = useState(null)
    const [isLoading,setIsLoading] = useState(false)
    
    const FetchAppointment = async() =>{
        setIsLoading(true)
        try{
            const data = await UserAppointmentDetailsApi(appointment_id)
            setAppointment(data)
        }catch(error){
            ErrorHandler(error)
        }finally{
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        FetchAppointment()
    },[appointment_id])


    const getStatusConfig = (status) =>{
        switch (status) {
            case 'booked':
                return{
                    color:'bg-blue-100 text-blue-800 border-blue-200',
                    icon:<CheckCircle className='h-4 w-4'/>,
                    bgColor:'bg-blue-50',
                    textColor:'text-blue-700'
                };
            case 'completed':
                return {
                    color:'bg-green-100 text-green-800 border-green-200',
                    icon:<CheckCircle className='h-4 w-4'/>,
                    bgColor:'bg-green-50',
                    textColor:'text-green-700'
                };
            case 'cancelled':
                return {
                    color:'bg-red-100 text-red-800 border-red-200',
                    icon:<XCircle className='h-4 w-4'/>,
                    bgColor:'bg-red-50',
                    textColor:'text-red-700'
                }
            default:
                return{
                    color:'bg-yellow-100 text-yellow-800 border-yellow-200',
                    icon:<AlertTriangle className='h-4 w-4'/>,
                    bgColor:'bg-yellow-50',
                    textColor:'text-yellow-700'
                };
        }
    }

    
  return (
    <Loading isLoading={isLoading}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <UserSidebar />
        <div className="flex-1 lg:ml-64 transition-all duration-300">
        <Navbar />
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              {appointment ? (
                <div className="space-y-6">
                  {/* Header Card */}
                  <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-500 to-blue-600 px-8 py-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h1 className="text-3xl font-bold text-white mb-2">
                            Appointment Details
                          </h1>
                          <p className="text-teal-100 text-lg">
                            Your mental health consultation
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="bg-white bg-opacity-20 rounded-lg p-4">
                            <div className="text-2xl font-bold text-white">
                              ₹{appointment.payment_amount}
                            </div>
                            <div className="text-sm text-teal-100">Session Fee</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Banner */}
                    <div className={`px-8 py-4 ${getStatusConfig(appointment.status).bgColor} border-l-4 border-teal-500`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getStatusConfig(appointment.status).icon}
                          <span className={`ml-2 font-semibold ${getStatusConfig(appointment.status).textColor}`}>
                            Status: {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                        <div className={`px-3 py-1 rounded-full border ${getStatusConfig(appointment.status).color}`}>
                          <span className="text-sm font-medium capitalize">{appointment.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Psychologist Info */}
                    <div className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-8">
                      <div className="flex items-start space-x-6">
                        <img src={appointment.psychologist_profile_pic || default_img} alt={appointment.psychologist_name} 
                        className='h-20 w-20 '/>
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Dr. {appointment.psychologist_name}
                          </h2>
                          <p className="text-gray-600 mb-4">{appointment.specialization}</p>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center text-gray-600">
                              <Mail className="h-4 w-4 mr-2 text-teal-500" />
                              <span className="text-sm">{appointment.psychologist_email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Phone className="h-4 w-4 mr-2 text-teal-500" />
                              <span className="text-sm">{appointment.psychologist_phone || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white shadow-lg rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                          <button
                            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={appointment.status !== 'booked'}
                          >
                            <MessageCircle className="h-5 w-5 mr-2" />
                            Start Chat
                          </button>
                        
                        <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200">
                          <Video className="h-5 w-5 mr-2" />
                          Video Call
                        </button>
                      </div>
                      {appointment.status === 'booked' &&(
                        <button
                         className='w-full flex items-center justify-center mt-2 px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200 border border-red-200'>
                            <XCircle className='w-4 h-4 mr-2'/>
                            Cancel Appointment
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                    <div className="bg-gray-50 px-8 py-4 border-b border-gray-200">
                      <h3 className="text-xl font-bold text-gray-800">Appointment Information</h3>
                    </div>
                    <div className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                              <Calendar className="h-6 w-6 text-teal-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-1">Date</h4>
                              <p className="text-gray-600">{appointment.slot_date}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Clock className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-1">Time</h4>
                              <p className="text-gray-600">{appointment.slot_time}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <IndianRupee className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-1">Payment</h4>
                              <p className="text-gray-600">₹{appointment.payment_amount}</p>
                              <p className="text-sm text-green-600 font-medium">✓ Paid</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                              <MapPin className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-1">Location</h4>
                              <p className="text-gray-600">Online Session</p>
                              <p className="text-sm text-purple-600 font-medium">Video Conference</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8 border border-teal-100">
                    <div className="flex items-center mb-4">
                      <Heart className="h-6 w-6 text-teal-600 mr-3" />
                      <h3 className="text-lg font-bold text-gray-800">Session Guidelines</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Please join the session 5 minutes early</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Ensure you have a stable internet connection</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Find a quiet and private space</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Have your questions ready</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No appointment details available.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
};


export default UserAppointmentDetails