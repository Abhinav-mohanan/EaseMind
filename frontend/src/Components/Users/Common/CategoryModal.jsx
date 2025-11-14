import React from 'react'

const CategoryModal = ({
    isOpen,
    onClose,
    onSubmit,
    category,
    value,
    onChange,
    error
}) => {
    if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
        <div className='bg-white rounded-xl shadow-xl p-6 w-full max-w-md'>
            <h2 className='text-xl font-bold text-slate-800 mb-4'>
                {category ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={onSubmit} className='space-y-4'>
                <div>
                    <input
                    type='text'
                    value={value}
                    onChange={onChange}
                    placeholder='Enter Category'
                    className='w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500
                    focus:border-teal-500 outline-none transition-all'
                />
                {error && <p className='text-red-600 text-sm mt-1'>{error}</p>}
                </div>
                <div>
                    <button
                    onClick={onClose}
                    type='button'
                    className='px-4 py-2 mr-2 bg-slate-300 rounded-lg text-gray-700 hover:bg-slate-400 transition-colors'>
                        Cancel
                    </button>
                    <button
                    type='submit'
                    className='px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-800 text-white font-medium rounded-lg 
                    hover:from-teal-700 hover:to-teal-900 transition-all'>
                        {category ? 'Update':'Create'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default CategoryModal