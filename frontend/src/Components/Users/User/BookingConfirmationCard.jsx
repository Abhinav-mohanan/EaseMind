import React from 'react'
import { Calendar, Clock, IndianRupee, AlertCircle, CheckCircle, X } from 'lucide-react'

const BookingConfirmationCard = ({ selectedSlot, setSelectedSlot, handlePayment, paymentLoading }) => {
  if (!selectedSlot) return null

    const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-Us", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setSelectedSlot(null)}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Confirm Booking</h3>
                  <p className="text-teal-100 text-sm">Review your appointment details</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSlot(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                disabled={paymentLoading}
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Booking Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              {/* Date */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <span className="text-sm font-medium text-slate-500">Date</span>
                </div>
                <p className="text-base font-semibold text-slate-900 ml-8">
                  {new Date(selectedSlot.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>

              {/* Start Time */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <span className="text-sm font-medium text-slate-500">Start Time</span>
                </div>
                <p className="text-base font-semibold text-slate-900 ml-8">
                  {formatTime(selectedSlot.start_time)}
                </p>
              </div>

              {/* End Time */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <span className="text-sm font-medium text-slate-500">End Time</span>
                </div>
                <p className="text-base font-semibold text-slate-900 ml-8">
                  {formatTime(selectedSlot.end_time)}
                </p>
              </div>

              {/* Amount */}
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 border border-teal-200">
                <div className="flex items-center space-x-3 mb-2">
                  <IndianRupee className="w-5 h-5 text-teal-700" />
                  <span className="text-sm font-medium text-teal-600">Amount</span>
                </div>
                <div className="flex items-center ml-8">
                  <span className="text-xl font-bold text-teal-900">
                    ₹{selectedSlot.payment_amount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg mb-5">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-800 mb-1">Payment Time Limit</h4>
                  <p className="text-sm text-amber-700">
                    You have <span className="font-bold">7 minutes</span> to complete the payment after confirmation.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedSlot(null)}
                disabled={paymentLoading}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {paymentLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Confirm Payment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmationCard