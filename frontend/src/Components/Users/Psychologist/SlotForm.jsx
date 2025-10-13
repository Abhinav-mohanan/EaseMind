import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, Edit3, X, IndianRupee } from 'lucide-react';
import { toast } from 'react-toastify';

const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 20; hour++) {
        times.push(`${String(hour).padStart(2, '0')}:00`);
        times.push(`${String(hour).padStart(2, '0')}:30`);
    }
    return times;
};

const INITIAL_FORM_STATE = {
    start_time: '',
    payment_amount: ''
};

const SimpleDatePicker = ({ selectedDates, onDateChange, minDate, maxDate, isEditMode }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    const isDateDisabled = (date) => {
        return date < minDate || date > maxDate;
    };
    
    const isDateSelected = (date) => {
        return selectedDates.some(d => d.toDateString() === date.toDateString());
    };
    
    const handleDateClick = (day) => {
        const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        if (!isDateDisabled(clickedDate)) {
            onDateChange(clickedDate);
        }
    }
    
    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };
    
    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const disabled = isDateDisabled(date);
        const selected = isDateSelected(date);
        
        days.push(
            <button
                key={day}
                type="button"
                onClick={() => handleDateClick(day)}
                disabled={disabled}
                className={`h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
                    ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-teal-50 cursor-pointer'}
                    ${selected ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 shadow-md' : ''}
                `}
            >
                {day}
            </button>
        );
    }
    
    return (
        <div className="bg-white rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
                <button type="button" onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h3 className="text-base font-semibold text-gray-800">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button type="button" onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="h-10 flex items-center justify-center text-xs font-semibold text-gray-500">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days}
            </div>
        </div>
    );
};

const SlotForm = ({ onSubmit, onUpdate, onCancelEdit, isEditMode, editingSlot }) => {
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [selectedDates, setSelectedDates] = useState([]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    useEffect(() => {
        if (isEditMode && editingSlot) {
            setFormData({
                start_time: editingSlot.start_time.slice(0, 5),
                payment_amount: editingSlot.payment_amount,
            });
            setSelectedDates([new Date(editingSlot.date)]);
        } else {
            setFormData(INITIAL_FORM_STATE);
            setSelectedDates([]);
        }
    }, [isEditMode, editingSlot]);

    const handleDateChange = (date) => {
        const formattedDate = date.toDateString();
        if (selectedDates.some(d => d.toDateString() === formattedDate)) {
            setSelectedDates(selectedDates.filter(d => d.toDateString() !== formattedDate));
        } else {
            setSelectedDates([...selectedDates, date]);
        }
    };

    const validateForm = () => {
        if (!formData.payment_amount || formData.payment_amount <= 100) {
            toast.error('Consultation fee must be greater than or equal 100');
            return false;
        }
        if (selectedDates.length === 0) {
            toast.error("Please select at least one date");
            return false;
        }
        if (!formData.start_time) {
            toast.error("Please select a start time");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const submissionData = {
            start_time: formData.start_time,
            payment_amount: parseFloat(formData.payment_amount)
        };
        
        let success = false;
        if (isEditMode) {
            const date = selectedDates[0];
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            submissionData.date = `${year}-${month}-${day}`;
            success = await onUpdate(editingSlot.id, submissionData);
        } else {
            success = await onSubmit(submissionData, selectedDates);
        }

        if (success) {
            setFormData(INITIAL_FORM_STATE);
            setSelectedDates([]);
        }
    };

    return (
        <div className="relative bg-gradient-to-br from-white via-teal-50/30 to-white rounded-2xl shadow-xl p-8 mb-8 border border-teal-100/50 overflow-hidden">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    {isEditMode ? (
                        <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
                            <Edit3 className="w-6 h-6 text-white" />
                        </div>
                    ) : (
                        <div className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                    )}
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-teal-800 to-gray-900 bg-clip-text text-transparent">
                        {isEditMode ? 'Edit Your Slot' : 'Schedule Your Availability'}
                    </h2>
                </div>
                <p className="text-sm text-gray-600 ml-14 font-medium">
                    {isEditMode ? 'Update the details for this specific slot.' : 'Create 30-minute consultation slots for your clients'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                            <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
                                <IndianRupee className="w-4 h-4 text-white" />
                            </div>
                            Consultation Fees
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg">₹</span>
                            <input
                                type="number"
                                value={formData.payment_amount}
                                onChange={(e) => setFormData({ ...formData, payment_amount: e.target.value })}
                                className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-base font-medium bg-white shadow-sm transition-all duration-200 hover:border-teal-300"
                                min="100"
                                step="100"
                                required
                                placeholder="Enter amount"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 ml-1">Minimum amount: ₹100</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                                <Clock className="w-4 h-4 text-white" />
                            </div>
                            Start Time
                        </label>
                        <select
                            value={formData.start_time}
                            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-base font-medium bg-white shadow-sm transition-all duration-200 hover:border-teal-300 cursor-pointer"
                            required
                        >
                            <option value="">Select time slot</option>
                            {generateTimeOptions().map((time) => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-2 ml-1">Available Time</p>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
                        <div className="p-1.5 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg">
                            <Calendar className="w-4 h-4 text-white" />
                        </div>
                        Select Date(s)
                    </label>
                    
                    <SimpleDatePicker
                        selectedDates={selectedDates}
                        onDateChange={isEditMode ? (date) => setSelectedDates([date]) : handleDateChange}
                        minDate={today}
                        maxDate={oneMonthLater}
                        isEditMode={isEditMode}
                    />
                    
                    <div className="mt-4 p-3 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-100">
                        <p className="text-xs font-semibold text-gray-600 mb-1">Selected Dates:</p>
                        <p className="text-sm font-medium text-teal-700">
                            {selectedDates.length > 0 
                                ? selectedDates.map(d => d.toLocaleDateString()).join(', ')
                                : 'No dates selected yet'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                    <button 
                        type="submit" 
                        className="group relative inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-base font-semibold rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-500 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                        <Sparkles className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">{isEditMode ? 'Update Slot' : 'Add Slots'}</span>
                    </button>
                    
                    {isEditMode && (
                        <button 
                            type="button" 
                            onClick={onCancelEdit} 
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-100 text-gray-700 text-base font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                        >
                            <X className="w-5 h-5" />
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default SlotForm;