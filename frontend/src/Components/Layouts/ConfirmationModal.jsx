import React from 'react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-50 rounded-md shadow-2xl p-6 w-full max-w-md border border-gray-200">
        <h3 className="text-xl font-serif font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-700 font-serif mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 font-serif rounded-sm hover:bg-gray-400 transition duration-200"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-2 bg-teal-500 text-white font-serif rounded-sm hover:bg-teal-600 transition duration-200"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
