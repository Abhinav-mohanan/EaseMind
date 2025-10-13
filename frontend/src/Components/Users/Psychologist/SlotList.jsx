import React, {useState } from 'react';
import SlotItem from './SlotItem';
import { ChevronDown, Filter, X } from 'lucide-react';

const SlotList = ({ slots, onEdit, onDelete,fetchSlots}) => {
    const [statusFilter,setStatusFilter] = useState('all')
    const [dateFilter,setDateFilter] = useState('')
    const [showFilters,setShowFilters] = useState(false)
    
    const clearFilters = () =>{
        setStatusFilter('all')
        setDateFilter('')
        fetchSlots(1,{})
        
    }

    const handleStatusFilter = (status) =>{
        setStatusFilter(status)
        const param = {date:dateFilter};
        if(status !== 'all'){
            param.status = status
        }
        fetchSlots(1,param)
    }
    const handleDateFilter = (date) =>{
        setDateFilter(date)
        if(date){
            const param = {date}
            if(statusFilter !== 'all'){
                param.status = statusFilter
            }
            fetchSlots(1,param)
        }else{
            const param ={}
            if (statusFilter != 'all'){
                param.status = statusFilter
            }
            fetchSlots(1,param)
        }
    }
    const hasActiveFilters = statusFilter !== 'all' || dateFilter !== '';
    console.log(statusFilter,dateFilter)
    
    if (slots.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-10 text-center border border-gray-200">
                <div className="w-16 h-16 mx-auto mb-4 bg-teal-50 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z">
                        </path>
                    </svg>
                </div>
                <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">No Time Slots Available</h3>
                <p className="text-sm text-gray-500">Add a slot above to get started.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="px-8 py-6 bg-teal-50 flex items-center justify-between">
                <h3 className="text-xl font-serif font-semibold text-gray-800">Appointment Slots</h3>
            <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-amber-300 rounded-lg text-amber-700 font-semibold hover:bg-amber-50 transition-all duration-200 shadow-sm">
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            </div>
            
            {showFilters && (
                <div className="px-8 py-6 bg-amber-50/50 border-b border-amber-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e)=>handleStatusFilter(e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-700 font-medium"
                            >
                                <option value="all" className='font-semibold'>All Slots</option>
                                <option value="available" className='font-semibold'>Available</option>
                                <option value="booked" className='font-semibold'>Booked</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Date</label>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e)=>handleDateFilter(e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-700 font-medium"
                            />
                        </div>
                        <div className="flex items-end">
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="w-full px-4 py-2.5 bg-rose-500 text-white rounded-lg font-semibold hover:bg-rose-600 transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <X className="w-4 h-4" />
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-teal-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-teal-500">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-teal-500">Time</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-teal-500">Fees</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-teal-500">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-teal-500">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {slots.map((slot) => (
                        <SlotItem key={slot.id} slot={slot} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SlotList;