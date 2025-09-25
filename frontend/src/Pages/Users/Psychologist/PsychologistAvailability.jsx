import React, { useEffect, useState } from 'react'
import { CreateSlotsApi, DeleteSlotApi, FetchSlotsApi, UpdateSlotApi } from '../../../api/appointmentApi'
import ErrorHandler from '../../../Components/Layouts/ErrorHandler'
import { toast } from 'react-toastify'
import Navbar from '../../../Components/Users/Navbar'
import PsychologistSidebar from '../../../Components/Users/Psychologist/PsychologistSidebar'
import Loading from '../../../Components/Layouts/Loading'
import Pagination from '../../../Components/Layouts/Pagination'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ConfirmationModal from '../../../Components/Layouts/Confirmationmodal'

const PsychologistAvailability = () => {
    const [slots, setSlots] = useState([])
    const [formData, setFormData] = useState({
        date: null,
        start_time: '',
        payment_amount: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [editMode, setEditMode] = useState(false)
    const [editingSlotId, setEditingSlotId] = useState(null)
    const [isModalOpen,setIsModalOpen] = useState(false)
    const [slotTodelete,setSlotToDelete] = useState(null)
    const page_size = 6
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const oneMonthLater = new Date()
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)

    const fetchSlots = async (page) => {
        try {
            setIsLoading(true)
            const data = await FetchSlotsApi(page)
            setSlots(data.results)
            setTotalPages(Math.ceil(data.count / page_size))
        } catch (error) {
            ErrorHandler(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchSlots(currentPage)
    }, [currentPage])

    const validateForm = () => {
        if (formData.payment_amount <= 500) {
            toast.error('Consultation fee must be greater than 500')
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return
        try {
            const year = formData.date.getFullYear()
            const month = String(formData.date.getMonth() + 1).padStart(2, '0')
            const day = String(formData.date.getDate()).padStart(2,'0')
            const formattedDate = `${year}-${month}-${day}`
            const data = {
                date: formattedDate,
                start_time: formData.start_time,
                payment_amount: parseFloat(formData.payment_amount)
            }
            if (editMode) {
                const response = await UpdateSlotApi(editingSlotId, data)
                toast.success('Slot updated successfully')
                setEditMode(false)
                setEditingSlotId(null)
            } else {
                const response = await CreateSlotsApi(data)
                toast.success("Time slot created")
            }
            setFormData({ date: null, start_time: '', payment_amount: '' })
            fetchSlots(currentPage)
        } catch (error) {
            ErrorHandler(error)
        }
    }

    const handleDelete = (slot_id) =>{
        setIsModalOpen(true)
        setSlotToDelete(slot_id)
    }

    const confirmDelete = async() =>{
        if (!slotTodelete) return
        try{
            const data = await DeleteSlotApi(slotTodelete)
            toast.success(data.message)
            fetchSlots(currentPage)
            setIsModalOpen(false)
        }catch(error){
            ErrorHandler(error)
            setIsModalOpen(false)
        }
    }

    const onCloseModal = () =>{
        setIsModalOpen(false)
        setSlotToDelete(null)
    }

    const generateTimeOptions = () => {
        const times = []
        for (let hour = 8; hour <= 20; hour++) {
            times.push(`${String(hour).padStart(2, '0')}:00`)
            times.push(`${String(hour).padStart(2, '0')}:30`)
        }
        return times
    }

    const handlePageChange = (PageNum) => {
        if (PageNum > 0 && PageNum <= totalPages) {
            setCurrentPage(PageNum)
        }
    }

    const handleEditSlot = (slotId) => {
        const slot = slots.find(slot => slot.id === slotId)
        if (!slot || slot.is_booked) {
            toast.error("Cannot edit a booked slot.")
            return
        }
        const formattedTime = slot.start_time.slice(0, 5) 

        setEditMode(true)
        setEditingSlotId(slotId)
        setFormData({
            date: new Date(slot.date),
            start_time: formattedTime,
            payment_amount: slot.payment_amount
        })
    }

    return (
        <Loading isLoading={isLoading}>
            <div className="min-h-screen bg-gray-50 pt-16">
                <PsychologistSidebar />
                <div className="ml-0 lg:ml-64 transition-all duration-300">
                    <Navbar />
                    <main className="flex-1 p-8">
                        <div className="max-w-5xl mx-auto">
                            <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-200">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold text-gray-900">Schedule Your Availability</h2>
                                    <p className="text-sm text-gray-500 font-light">Create 30-minute consultation slots for your clients</p>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fees (₹)</label>
                                            <input
                                                type="number"
                                                value={formData.payment_amount}
                                                onChange={(e) => setFormData({ ...formData, payment_amount: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm"
                                                min="0"
                                                step="0.01"
                                                required
                                                placeholder="Enter consultation amount"
                                            />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                                            <DatePicker
                                                selected={formData.date}
                                                onChange={(date) => setFormData({ ...formData, date })}
                                                dateFormat="yyyy-MM-dd"
                                                minDate={today}
                                                maxDate={oneMonthLater}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm"
                                                required
                                                placeholderText="Select a date"
                                                popperPlacement="right-start"
                                                popperModifiers={[
                                                    {
                                                        name: 'offset',
                                                        options: {
                                                            offset: [0, 10],
                                                        },
                                                    },
                                                    {
                                                        name: 'preventOverflow',
                                                        options: {
                                                            rootBoundary: 'viewport',
                                                            tether: false,
                                                            altAxis: true,
                                                        },
                                                    },
                                                ]}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                            <select
                                                value={formData.start_time}
                                                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white shadow-sm"
                                                required
                                            >
                                                <option value="">Select time</option>
                                                {generateTimeOptions().map((time) => (
                                                    <option key={time} value={time}>{time}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            type="submit"
                                            className="inline-flex items-center px-6 py-3 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors duration-300 shadow-md"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                            </svg>
                                            {editMode ? 'Update Slot' : 'Add Slot'}
                                        </button>
                                        {editMode && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditMode(false)
                                                    setEditingSlotId(null)
                                                    setFormData({ date: null, start_time: '', payment_amount: '' })
                                                }}
                                                className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors duration-300 shadow-sm"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                            {slots.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-lg p-10 text-center border border-gray-200">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-teal-50 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">No Time Slots Available</h3>
                                    <p className="text-sm text-gray-500">Add a slot above to get started.</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                                    <div className="px-8 py-6 bg-teal-50">
                                        <h3 className="text-xl font-serif font-semibold text-gray-800">Available Slots</h3>
                                    </div>
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-teal-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-teal-500">Date</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-teal-500">Time</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-teal-500">Fees </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-teal-500">Status</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-teal-500">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {slots.map((slot) => (
                                                <tr key={slot.id} className="hover:bg-teal-50 transition-colors duration-150">
                                                    <td className="px-6 py-4 text-sm text-gray-900">{slot.date}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{`${slot.start_time} - ${slot.end_time}`}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{slot.payment_amount}</td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                                slot.is_booked ? 'bg-red-100 text-red-800' : 'bg-teal-100 text-teal-800'
                                                            }`}
                                                        >
                                                            {slot.is_booked ? 'Booked' : 'Available'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        {!slot.is_booked && (
                                                            <>
                                                            <button
                                                                onClick={() => handleEditSlot(slot.id)}
                                                                className="text-teal-500 hover:text-gray-800 font-medium transition-colors duration-200"
                                                                >
                                                                Edit
                                                            </button>
                                                            <button
                                                            onClick={()=>handleDelete(slot.id)}
                                                            className='text-teal-500 m-4 hover:text-gray-800 font-medium transition-colors duration-200'>
                                                            Delete
                                                            </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {totalPages > 1&&(
                                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                                    )}
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
            <ConfirmationModal
            isOpen={isModalOpen}
            onClose={onCloseModal}
            onConfirm={confirmDelete}
            title='Delete Article'
            message='Are you sure you want to delete this slot? This action cannot be undone.'
            confirmText='Delete'
            cancelText='Cancel'/>
        </Loading>
    )
}

export default PsychologistAvailability