import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ErrorHandler from './ErrorHandler';
import { X, AlertTriangle } from 'lucide-react';

const ActionModal = ({
  isOpen,
  onClose,
  id,
  actionApi,
  refetch,
  type = 'cancellation', 
  title = 'Confirm Cancellation',
  prompt = 'Are you sure you want to cancel this? Please provide a reason.',
  confirmText = 'Confirm Cancellation'
}) => {
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setIsLoading] = useState(false);

  const handleAction = async () => {
    if (!description.trim()) {
      setError('Please provide a reason.');
      return;
    }
    if (description.length < 10) {
      setError('Reason must be at least 10 characters.');
      return;
    }
    try {
      setIsLoading(true);
      const data = await actionApi(id, type === 'cancellation' ? { description, action: 'cancel' } : { description, action: 'reject' });
      toast.success(data.message || `${type.charAt(0).toUpperCase() + type.slice(1)} successful`);
      refetch();
      onClose();
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/70 to-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
        <div className="relative bg-gradient-to-r from-red-50 to-orange-50 rounded-t-3xl px-8 py-6 border-b border-red-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                <p className="text-sm text-red-600 font-medium">Action Required</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          <p className="text-gray-700 mb-6 leading-relaxed">{prompt}</p>
          
          <div className="relative mb-4">
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (error) setError('');
              }}
              placeholder={`Enter ${title.toLowerCase()} reason`}
              className={`w-full p-4 border-2 rounded-xl resize-none transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-100 ${
                error 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 focus:border-red-400 focus:bg-white'
              }`}
              rows="4"
              disabled={loading}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {description.length}/500 words
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm font-medium flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                {error}
              </p>
            </div>
            )}

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Close
            </button>
            <button
              onClick={handleAction}
              disabled={loading || !description.trim()}
              className={`flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                loading ? 'animate-pulse' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;