import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ErrorHandler from '../../../Components/Layouts/ErrorHandler'
import Navbar from '../../../Components/Users/Navbar'
import { Award, BookOpen, Calendar, Clock, Mail, Phone, User } from 'lucide-react'
import default_img from '../../../assets/default_image.png'
import { BookSlotApi, CreateRazorpayOrderApi, LockSlotApi, PsychologistDetailApi } from '../../../api/appointmentApi'
import Loading from '../../../Components/Layouts/Loading'
import { toast } from 'react-toastify'
import { DateTime } from 'luxon'

const PsychologistDetail = () => {
  const { psychologist_id } = useParams()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [paymentLoading,setPaymentLoading] = useState(false)
  const itemPerPage = 3

  const FetchPsychologist = async () => {
    try {
      setIsLoading(true)
      const data = await PsychologistDetailApi(psychologist_id)
      setProfile(data)
    } catch (error) {
      ErrorHandler(error)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    FetchPsychologist();
  }, [psychologist_id]);

  // Group slots by date
  const groupedSlots = profile?.slots?.reduce((acc, slot) => {
    const date = slot.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc
  }, {}) || {}

  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot);
  }

  const isSlotDisabled = (slotDate, slotTime, locked_until) => {
    const now = DateTime.now().setZone('Asia/Kolkata');
    const slotDateTime = DateTime.fromISO(`${slotDate}T${slotTime}`, { zone: 'Asia/Kolkata' });
    const isPast = slotDateTime < now;
    const isLocked = locked_until ? DateTime.fromISO(locked_until, { zone: 'Asia/Kolkata' }) > now : false;
    return isPast || isLocked;
  };
  const lockSlot = async(slot_id =selectedSlot.id) =>{
    try{
      const data = await LockSlotApi(slot_id)
      return true
    }catch(error){
      ErrorHandler(error)
      return false
    }
  } 

  const handlePayment = async()=>{
    if(!selectedSlot) return
    const locked = await lockSlot(selectedSlot.id)
    if(!locked){
      setSelectedSlot(null)
      return
    }
    setPaymentLoading(true)
    try{
      const orderdata = await CreateRazorpayOrderApi({amount:selectedSlot.payment_amount * 100})
      const {order_id,razorpay_key,amount,email,phone_number,name} = orderdata
      const razorpay = new window.Razorpay({
        key:razorpay_key,
        amount:amount,
        currency:'INR',
        name:"EaseMind",
        description:`Booking for ${selectedSlot.start_time} on ${selectedSlot.date}`,
        order_id:order_id,
        theme:{
          "color":"#3399c"
        },
        prefill:{
          "name":name,
          "email":email,
          "contact":phone_number
        },
        config:{
          display:{
            contact:true,
            email:true,
          }
        },
        handler:async(response)=>{
          const paymentData = {
            razorpay_payment_id:response.razorpay_payment_id,
            razorpay_order_id:response.razorpay_order_id,
            razorpay_signature:response.razorpay_signature,
            slot_id:selectedSlot.id,
            amount:selectedSlot.payment_amount,
          }
          try{
            const data = await BookSlotApi(paymentData)
            toast.success(data.message)
            setSelectedSlot(null)
            setPaymentLoading(false)
            FetchPsychologist()
          }catch(error){
            ErrorHandler(error)
            selectedSlot(null)
            setPaymentLoading(false)
          }
        },
        modal:{
          ondismiss:() =>{
            setPaymentLoading(false)
            toast.error("Payment Cancelled")
            setSelectedSlot(null)
            FetchPsychologist()
          }
        }
      })
      razorpay.open()
    }catch(error){
      ErrorHandler(error)
      setPaymentLoading(false)
    }
  }



  return (
    <Loading isLoading={isLoading}>
      <div className="min-h-screen bg-gray-50 to-blue-50">
        <Navbar />
        <main className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Sidebar - Profile Info */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl p-8 h-auto sticky top-8">
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <img
                        src={profile?.psychologist?.profile_picture || default_img}
                        alt={profile?.psychologist?.user_name || 'Psychologist'}
                        className="w-32 h-32 rounded-full object-cover border-4 border-teal-100 shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                      {profile?.psychologist?.name?.toUpperCase() || 'N/A'}
                    </h1>
                    <p className="text-teal-600 font-medium mb-3">
                      {profile?.psychologist?.specialization || 'N/A'}
                    </p>
                  </div>

                  <div className="space-y-4 border-t border-gray-200 pt-6">
                    <div className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-teal-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Experience</p>
                        <p className="text-sm text-gray-600">{profile?.psychologist?.experience_years || 0} years</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-teal-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Education</p>
                        <p className="text-sm text-gray-600">{profile?.psychologist?.education || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-teal-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Phone</p>
                        <p className="text-sm text-gray-600">{profile?.psychologist?.phone_number || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-teal-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Email</p>
                        <p className="text-sm text-gray-600">{profile?.psychologist?.email || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Bio and Appointments */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <User className="h-6 w-6 text-teal-500 mr-3" />
                    About Dr. {profile?.psychologist?.name?.toUpperCase() || 'N/A'}
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {profile?.psychologist?.bio || 'No bio available.'}
                  </p>
                  <div className="mt-6 p-4 bg-teal-50 rounded-lg border-l-4 border-teal-500">
                    <p className="text-sm text-teal-700">
                      <strong>License Number:</strong> {profile?.psychologist?.license_no || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Appointment Booking */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <Calendar className="h-6 w-6 text-teal-500 mr-3" />
                    Book an Appointment
                  </h2>

                  {Object.keys(groupedSlots).length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(groupedSlots)
                        .slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage)
                        .map(([date, slots]) => (
                          <div
                            key={date}
                            className="border border-gray-200 rounded-xl p-6 hover:border-teal-300 transition-colors"
                          >
                            <div className="flex items-center mb-4">
                              <div className="bg-teal-100 rounded-lg p-3 mr-4">
                                <Calendar className="h-6 w-6 text-teal-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {new Date(date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {slots.filter((slot) => !slot.is_booked).length} slots available
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                              {slots.map((slot) => (
                                <button
                                  key={slot.id}
                                  onClick={() => handleSlotSelection(slot)}
                                  disabled={slot.is_booked || isSlotDisabled(slot.date,slot.start_time,slot.locked_until)}
                                  className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed ${
                                    slot.is_booked || isSlotDisabled(slot.date,slot.start_time,slot.locked_until)
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                      : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 hover:border-teal-300 hover:shadow-md'
                                  }`}
                                >
                                  <Clock className="h-4 w-4" />
                                  <span>{slot.start_time}</span>
                                  {slot.is_booked && <span className="text-xs">(Booked)</span>}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      {/* Pagination Controls */}
                      <div className="flex justify-between items-center px-4 py-3 bg-white border-t border-gray-200">
                        <button
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 text-sm text-teal-600 hover:text-teal-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="text-sm text-gray-700">
                          Page {currentPage} of {Math.ceil(Object.keys(groupedSlots).length / itemPerPage)}
                        </span>
                        <button
                          onClick={() => setCurrentPage((prev) => prev + 1)}
                          disabled={currentPage * itemPerPage >= Object.keys(groupedSlots).length}
                          className="px-4 py-2 text-sm text-teal-600 hover:text-teal-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg">No available slots at the moment.</p>
                      <p className="text-gray-500 text-sm">Please check back later or contact us directly.</p>
                    </div>
                  )}
                </div>

                {/* Payment Modal */}
                {selectedSlot && (
                  <div className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Booking</h3>
                    <p className="text-gray-700 mb-2">
                      <strong>Date:</strong> {selectedSlot.date}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Time:</strong> {selectedSlot.start_time}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>End Time:</strong> {selectedSlot.end_time}
                    </p>
                    <p className="text-gray-700 mb-4">
                      <strong>Amount:</strong> {selectedSlot.payment_amount}
                    </p>
                    <p className='text-red-500 text-sm m-3'>⚠️ when ever you confirm You have 7 minutes to complete the payment.</p>
                    <button
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors disabled:bg-teal-400">
                      {paymentLoading?'Processing..':'Confirm Payment'}
                    </button>
                    <button
                      onClick={() => setSelectedSlot(null)}
                      className="ml-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Loading>
  );
};

export default PsychologistDetail;