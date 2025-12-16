import React from 'react'
import { Wallet, CreditCard, Building2, AlertCircle, IndianRupee, X } from 'lucide-react'

const BankDetailsModal = ({ 
  isModalOpen, 
  setIsModalOpen, 
  walletData, 
  hasPendingPayout, 
  fromData, 
  setFromData, 
  handlePayout, 
  isSubmitting 
}) => {
  if (!isModalOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Request Payout</h1>
                <p className="text-teal-100 text-sm mt-0.5">Withdraw funds to your bank</p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 mb-5 border border-teal-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-teal-700">Available Balance</span>
              <div className="flex items-center space-x-1">
                <IndianRupee className="w-5 h-5 text-teal-700" />
                <span className="text-2xl font-bold text-teal-900">
                  {walletData?.actualBalance?.toLocaleString() || '0'}
                </span>
              </div>
            </div>
          </div>

          {hasPendingPayout && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg mb-5">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-amber-800 mb-1">Pending Request</h3>
                  <p className="text-sm text-amber-700">
                    You have a pending payout request. Please wait for processing.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handlePayout} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Payout Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <IndianRupee className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="number"
                  name="amount"
                  value={fromData.amount}
                  onChange={(e) => setFromData({ ...fromData, amount: parseFloat(e.target.value)})}
                  min="1"
                  max={walletData?.actualBalance}
                  placeholder="Enter amount"
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 
                  focus:border-teal-500 transition-all disabled:bg-slate-50 disabled:text-slate-400 text-slate-900 placeholder-slate-400"
                  disabled={hasPendingPayout || isSubmitting}
                  required
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                Maximum: ₹{walletData?.actualBalance?.toLocaleString() || '0'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Bank Account Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="bank_account_no"
                  value={fromData.bank_account_no}
                  onChange={(e) => setFromData({ ...fromData, bank_account_no: e.target.value })}
                  placeholder="Enter account number"
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                  transition-all disabled:bg-slate-50 disabled:text-slate-400 text-slate-900 placeholder-slate-400"
                  disabled={hasPendingPayout || isSubmitting}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                IFSC Code <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="ifsc_code"
                  value={fromData.ifsc_code}
                  onChange={(e) => setFromData({ ...fromData, ifsc_code: e.target.value.toUpperCase() })}
                  placeholder="Enter IFSC code"
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 
                  focus:border-teal-500 transition-all disabled:bg-slate-50 disabled:text-slate-400 text-slate-900 placeholder-slate-400 uppercase"
                  disabled={hasPendingPayout || isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting || hasPendingPayout}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-xl hover:from-teal-700 
                hover:to-teal-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Confirm Payout</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BankDetailsModal