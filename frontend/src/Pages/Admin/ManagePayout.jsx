import React, { useEffect, useState } from 'react'
import AdminSidebar from '../../Components/Admin/AdminSidebar'
import AdminHeader from '../../Components/Admin/AdminHeader'
import { WalletMinimal } from 'lucide-react'
import { FetchPayoutApi, handlePayoutApi } from '../../api/adminApi'
import ErrorHandler from '../../Components/Layouts/ErrorHandler'
import Loading from '../../Components/Layouts/Loading'
import Pagination from '../../Components/Layouts/Pagination'
import PayoutActionModal from '../../Components/Admin/PayoutActionModal'
import PayoutTable from '../../Components/Admin/PayoutTable'
import { toast } from 'react-toastify'

const ManagePayout = () => {
    const [statusFilter, setStatusFilter] = useState('pending')
    const [payouts, setPayouts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [showModal, setShowModal] = useState(false)
    const [selectedPayout, setSelectedPayout] = useState(null)
    const [modalType, setModalType] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const page_size = 6

    const fetchPayouts = async () => {
        setIsLoading(true)
        try {
            const data = await FetchPayoutApi(statusFilter, currentPage)
            setPayouts(data.results)
            setTotalPages(Math.ceil(data.count / page_size))
        } catch (error) {
            ErrorHandler(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPayouts()
    }, [statusFilter, currentPage])

    const handlePageChange = (pageNum) => {
        if (pageNum > 0 && pageNum <= totalPages) {
            setCurrentPage(pageNum)
        }
    }

    const handleActionClick = (payout, type) => {
        setSelectedPayout(payout)
        setModalType(type)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setSelectedPayout(null)
        setModalType('')
    }

    const handleSubmitAction = async (type, remarks) => {
        setIsSubmitting(true)
        try {
            const payload = {
                status: type === 'approve' ? 'approved' : 'rejected'
            }

            if (type === 'reject' && remarks) {
                payload.remarks = remarks
            }
            const data = await handlePayoutApi(selectedPayout.id,payload)
            toast.success(data.message || `Payout ${type === 'approve' ? 'approved' : 'rejected'} successfully`)
            fetchPayouts()
            handleCloseModal()
        } catch (error) {
            ErrorHandler(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Loading isLoading={isLoading}>
            <div className='flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
                <AdminSidebar />
                <div className='flex-1 ml-64 bg-gray-50'>
                    <AdminHeader />
                    <div className='p-6'>
                        <div className='max-w-7xl mx-auto'>
                            <div className='bg-white rounded-2xl shadow-xl border border-slate-200 mb-8 overflow-hidden'>
                                <div className='bg-gradient-to-r from-teal-600 via-teal-600 to-teal-800 px-8 py-6'>
                                    <div className='flex items-center space-x-4'>
                                        <div className='p-3 bg-white/20 rounded-xl backdrop-blur-sm'>
                                            <WalletMinimal className='w-8 h-8 text-white' />
                                        </div>
                                        <div>
                                            <h1 className='text-3xl font-bold text-white mb-1'>Payout Dashboard</h1>
                                            <p className='text-teal-100'>Manage and monitor all payout requests</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='px-8 py-6 border-b border-slate-200'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex space-x-1 bg-slate-100 p-1 rounded-xl'>
                                            <button
                                                onClick={() => {
                                                    setStatusFilter('pending')
                                                    setCurrentPage(1)
                                                }}
                                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                                    statusFilter === 'pending'
                                                        ? 'bg-white text-yellow-700 shadow-md border border-yellow-200'
                                                        : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                                                }`}
                                            >
                                                <span className='flex items-center space-x-2'>
                                                    <div className={`w-2 h-2 rounded-full ${statusFilter === 'pending' ? 'bg-yellow-500' : 'bg-slate-400'}`}></div>
                                                    <span>Pending</span>
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setStatusFilter('approved')
                                                    setCurrentPage(1)
                                                }}
                                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                                    statusFilter === 'approved'
                                                        ? 'bg-white text-green-700 shadow-md border border-green-200'
                                                        : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                                                }`}
                                            >
                                                <span className='flex items-center space-x-2'>
                                                    <div className={`w-2 h-2 rounded-full ${statusFilter === 'approved' ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                                                    <span>Approved</span>
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setStatusFilter('rejected')
                                                    setCurrentPage(1)
                                                }}
                                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                                    statusFilter === 'rejected'
                                                        ? 'bg-white text-red-700 shadow-md border border-red-200'
                                                        : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                                                }`}
                                            >
                                                <span className='flex items-center space-x-2'>
                                                    <div className={`w-2 h-2 rounded-full ${statusFilter === 'rejected' ? 'bg-red-500' : 'bg-slate-400'}`}></div>
                                                    <span>Rejected</span>
                                                </span>
                                            </button>
                                        </div>
                                        <div className='text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-lg'>
                                            <span className='font-medium'>{payouts.length}</span> {statusFilter} payout {payouts.length === 1 ? 'request' : 'requests'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {payouts.length > 0 ? (
                                <>
                                    <PayoutTable 
                                        payouts={payouts}
                                        statusFilter={statusFilter}
                                        onActionClick={handleActionClick}
                                    />
                                    {totalPages > 1 && (
                                        <div className='mt-6'>
                                            <Pagination 
                                                currentPage={currentPage} 
                                                totalPages={totalPages} 
                                                onPageChange={handlePageChange}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className='bg-white rounded-2xl shadow-xl border border-slate-200 p-12 text-center'>
                                    <div className='w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center'>
                                        <WalletMinimal className='w-12 h-12 text-slate-400' />
                                    </div>
                                    <h3 className='text-xl font-semibold text-slate-700 mb-2'>
                                        No {statusFilter} payouts found
                                    </h3>
                                    <p className='text-slate-500'>
                                        There are currently no payout requests with {statusFilter} status.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <PayoutActionModal
                isOpen={showModal}
                onClose={handleCloseModal}
                payout={selectedPayout}
                modalType={modalType}
                onSubmit={handleSubmitAction}
                isSubmitting={isSubmitting}
            />
        </Loading>
    )
}

export default ManagePayout