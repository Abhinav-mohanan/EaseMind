
import React from 'react';
import { Calendar, Clock} from 'lucide-react';

    const SlotItem = ({ slot, onEdit, onDelete }) => {
        return (
            <tr className="border-b border-gray-100 hover:bg-teal-50/30 transition-all duration-300 group">
                <td className="px-6 py-5 text-sm text-gray-800 font-medium">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-teal-600" />
                        {slot.date}
                    </div>
                </td>
                <td className="px-6 py-5 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-600" />
                        {`${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`}
                    </div>
                </td>
                <td className="px-6 py-5 text-sm font-semibold text-gray-900">
                    ₹{slot.payment_amount}
                </td>
                <td className="px-6 py-5 text-sm">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide ${
                        slot.is_booked 
                            ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            slot.is_booked ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}></span>
                        {slot.is_booked ? 'Booked' : 'Available'}
                    </span>
                </td>
                <td className="px-6 py-5 text-sm">
                    {!slot.is_booked && (
                        <div className="flex items-center gap-3 opacity-100 transition-opacity duration-200">
                            <button 
                                onClick={() => onEdit(slot)} 
                                className="text-orange-600 hover:text-orange-800 font-medium transition-colors duration-200 hover:underline"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => onDelete(slot.id)} 
                                className="text-rose-600 hover:text-rose-800 font-medium transition-colors duration-200 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </td>
            </tr>
        );
    };

    export default SlotItem;