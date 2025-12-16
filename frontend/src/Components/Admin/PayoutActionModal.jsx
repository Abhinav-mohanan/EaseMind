import React, { useState } from 'react'
import { X, CheckCircle, XCircle, AlertCircle, User, Calendar, CreditCard, HandCoins, IndianRupee } from 'lucide-react'

const PayoutActionModal = ({ 
    isOpen, 
    onClose, 
    payout, 
    modalType, 
    onSubmit, 
    isSubmitting 
}) => {
    const [remarks, setRemarks] = useState('')

    if (!isOpen || !payout) return null

    const handleSubmit = () => {
        onSubmit(modalType, remarks)
    }

    const handleClose = () => {
        setRemarks('')
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />
            
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
                    <div className={`px-8 py-6 rounded-t-2xl ${
                        modalType === 'approve' 
                            ? 'bg-gradient-to-r from-green-600 to-green-700' 
                            : 'bg-gradient-to-r from-red-600 to-red-700'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    {modalType === 'approve' ? (
                                        <CheckCircle className="w-7 h-7 text-white" />
                                    ) : (
                                        <XCircle className="w-7 h-7 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {modalType === 'approve' ? 'Approve Payout' : 'Reject Payout'}
                                    </h2>
                                    <p className="text-white/90 text-sm mt-1">
                                        Review the details carefully before proceeding
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                disabled={isSubmitting}
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>
                    </div>

                    <div className="px-8 py-6">
                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 mb-6 border border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                                <AlertCircle className="w-5 h-5 mr-2 text-teal-600" />
                                Payout Details
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg p-4 border border-slate-200">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <User className="w-5 h-5 text-teal-600" />
                                        <span className="text-sm font-medium text-slate-500">Psychologist</span>
                                    </div>
                                    <p className="text-base font-semibold text-slate-900 ml-8">
                                        {payout.psychologist_name}
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg p-4 border border-slate-200">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <IndianRupee className="w-5 h-5 text-teal-600" />
                                        <span className="text-sm font-medium text-slate-500">Amount</span>
                                    </div>
                                    <p className="text-base font-semibold text-slate-900 ml-8">
                                        ₹{payout.amount?.toLocaleString()}
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg p-4 border border-slate-200">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <CreditCard className="w-5 h-5 text-teal-600" />
                                        <span className="text-sm font-medium text-slate-500">Bank Account</span>
                                    </div>
                                    <p className="text-base font-semibold text-slate-900 ml-8">
                                        {payout.bank_account_no}
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg p-4 border border-slate-200">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <HandCoins className="w-5 h-5 text-teal-600" />
                                        <span className="text-sm font-medium text-slate-500">IFSC Code</span>
                                    </div>
                                    <p className="text-base font-semibold text-slate-900 ml-8">
                                        {payout.ifsc_code}
                                    </p>
                                </div>

                                <div className="bg-white rounded-lg p-4 border border-slate-200 col-span-2">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <Calendar className="w-5 h-5 text-teal-600" />
                                        <span className="text-sm font-medium text-slate-500">Requested Date</span>
                                    </div>
                                    <p className="text-base font-semibold text-slate-900 ml-8">
                                        {new Date(payout.requested_at).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {modalType === 'reject' && (
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    Rejection Remarks <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Please provide a reason for rejecting this payout request..."
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 
                                    transition-all resize-none text-slate-700 placeholder-slate-400"
                                    rows="4"
                                    disabled={isSubmitting}
                                    required
                                />
                                {remarks.trim() === '' && (
                                    <p className="mt-2 text-sm text-amber-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        Remarks are required for rejection
                                    </p>
                                )}
                            </div>
                        )}

                        <div className={`rounded-xl p-4 mb-6 border-2 ${
                            modalType === 'approve' 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-red-50 border-red-200'
                        }`}>
                            <div className="flex items-start space-x-3">
                                <AlertCircle className={`w-5 h-5 mt-0.5 ${
                                    modalType === 'approve' ? 'text-green-600' : 'text-red-600'
                                }`} />
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${
                                        modalType === 'approve' ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                        {modalType === 'approve' 
                                            ? 'This action will deduct the amount from the psychologist\'s wallet and process the payout.'
                                            : 'This action will reject the payout request. The psychologist will be notified with your remarks.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-6 bg-slate-50 rounded-b-2xl border-t border-slate-200 flex justify-end space-x-4">
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-all 
                            duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || (modalType === 'reject' && remarks.trim() === '')}
                            className={`px-6 py-3 font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                                modalType === 'approve'
                                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl'
                                    : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    {modalType === 'approve' ? (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            <span>Approve Payout</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-5 h-5" />
                                            <span>Reject Payout</span>
                                        </>
                                    )}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PayoutActionModal