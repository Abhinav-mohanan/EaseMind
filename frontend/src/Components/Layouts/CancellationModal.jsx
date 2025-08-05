import React, { useState } from 'react'
import { toast } from 'react-toastify'
import ErrorHandler from './ErrorHandler'

const CancellationModal = ({
    isOpen,
    onClose,
    appointment_id,
    cancelApi,
    refetch
}) => {
    const [description,setDescription] = useState('')
    const [error,setError] = useState('')
    const [loading,setIsLoading] = useState(false)

    const handleCancel = async() =>{
        if (!description.trim()){
            setError('Please provide a reason for cancellation.')
            return
        }
        if (description && description.length < 10){
            setError('Reasons must be at lease 10 characters')
            return
        }
        try{
            setIsLoading(true)
            const data = await cancelApi(appointment_id,{description})
            toast.success(data.message)
            refetch()
            onClose()
        }catch(error){
            ErrorHandler(error)
        }finally{
            setIsLoading(false)
        }
    }
    if(!isOpen) return null
return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h2 className="text-xl font-semibold mb-4">Confirm Cancellation</h2>
                <p className="mb-4">
                    Are you sure you want to cancel this appointment? Please provide a reason.
                </p>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter cancellation reason"
                    className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    disabled={loading}
                />
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        disabled={loading}
                    >
                        Close
                    </button>
                    <button
                        onClick={handleCancel}
                        className={`px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={loading}
                    >
                        {loading ? 'Cancelling...' : 'Confirm Cancellation'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CancellationModal