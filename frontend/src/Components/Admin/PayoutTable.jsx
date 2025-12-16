import React from 'react'
import { Calendar, CreditCard, HandCoins, CheckCircle, XCircle } from 'lucide-react'

const PayoutTable = ({ payouts, statusFilter, onActionClick }) => {
    return (
        <div className='bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden'>
            <div className='overflow-x-auto'>
                <table className='min-w-full'>
                    <thead>
                        <tr className='bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200'>
                            <th className='px-8 py-4 text-left text-sm font-semibold text-slate-700'>Psychologist</th>
                            <th className='px-8 py-4 text-left text-sm font-semibold text-slate-700'>Amount</th>
                            <th className='px-6 py-4 text-left text-sm font-semibold text-slate-700'>Requested Date</th>
                            <th className='px-6 py-4 text-left text-sm font-semibold text-slate-700'>Bank Account No</th>
                            <th className='px-6 py-4 text-left text-sm font-semibold text-slate-700'>IFSC Code</th>
                            <th className='px-6 py-4 text-left text-sm font-semibold text-slate-700'>Status</th>
                            {statusFilter === 'rejected' && (
                                <th className='px-6 py-4 text-left text-sm font-semibold text-slate-700'>Remarks</th>
                            )}
                            {statusFilter === 'pending' && (
                                <th className='px-6 py-4 text-center text-sm font-semibold text-slate-700'>Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-200'>
                        {payouts.map((payout) => (
                            <tr key={payout.id} className='hover:bg-slate-50 transition-colors duration-150'>
                                <td className='px-8 py-6'>
                                    <div className='flex items-center space-x-4'>
                                        <div className='relative'>
                                            <div className='w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center 
                                            justify-center text-white text-sm font-bold shadow-sm'>
                                                {payout.psychologist_name?.charAt(0) || 'U'}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className='font-semibold text-slate-900'>{payout.psychologist_name}</h3>
                                        </div>
                                    </div>
                                </td>
                                <td className='px-8 py-6'>
                                    <div className='flex items-center'>
                                        <span className='text-lg font-bold text-slate-900'>₹{payout.amount?.toLocaleString()}</span>
                                    </div>
                                </td>
                                <td className='px-6 py-6'>
                                    <div className='flex items-center space-x-2'>
                                        <Calendar className='h-5 w-5 text-teal-500' />
                                        <span className='text-sm text-slate-600'>
                                            {new Date(payout.requested_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </td>
                                <td className='px-6 py-6'>
                                    <div className='flex items-center space-x-2'>
                                        <CreditCard className='h-5 w-5 text-teal-500' />
                                        <span className='text-sm font-medium text-slate-900'>{payout.bank_account_no}</span>
                                    </div>
                                </td>
                                <td className='px-6 py-6'>
                                    <div className='flex items-center space-x-2'>
                                        <HandCoins className='h-5 w-5 text-teal-500' />
                                        <span className='text-sm font-medium text-slate-900'>{payout.ifsc_code || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className='px-6 py-6'>
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
                                        payout.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                        payout.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                                        'bg-red-100 text-red-800 border border-red-200'
                                    }`}>
                                        {payout.status}
                                    </span>
                                </td>
                                {payout.status === 'rejected' && (
                                    <td className='px-6 py-6'>
                                        <div className='max-w-xs'>
                                            <p className='text-sm text-slate-700 line-clamp-2'>{payout.remarks || 'No remarks provided'}</p>
                                        </div>
                                    </td>
                                )}
                                {payout.status === 'pending' && (
                                    <td className='px-6 py-6'>
                                        <div className='flex items-center justify-center space-x-3'>
                                            <button
                                                onClick={() => onActionClick(payout, 'approve')}
                                                className='group relative px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium 
                                                rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2'
                                            >
                                                <CheckCircle className='w-4 h-4' />
                                                <span>Approve</span>
                                            </button>
                                            <button
                                                onClick={() => onActionClick(payout, 'reject')}
                                                className='group relative px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium 
                                                rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2'
                                            >
                                                <XCircle className='w-4 h-4' />
                                                <span>Reject</span>
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PayoutTable