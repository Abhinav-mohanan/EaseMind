import React from 'react'
import { Edit, Trash } from 'lucide-react'

const CategoryTable = ({ categories, onEdit, onDelete, formatDate }) => {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full border border-slate-200 rounded-xl'>
        <thead className='bg-slate-100 border-b border-slate-200'>
          <tr>
            <th className='px-4 py-3 text-left text-sm font-semibold text-slate-700'>Sl.No</th>
            <th className='px-4 py-3 text-left text-sm font-semibold text-slate-700'>Category Name</th>
            <th className='px-4 py-3 text-left text-sm font-semibold text-slate-700'>Created at</th>
            <th className='px-4 py-3 text-left text-sm font-semibold text-slate-700'>Actions</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-slate-200'>
          {categories.map((cat, indx) => (
            <tr key={cat.id} className='hover:bg-slate-50 transition-colors'>
              <td className='px-6 py-4 text-sm text-slate-600'>{indx + 1}</td>
              <td className='px-6 py-4 text-md text-slate-800 font-medium uppercase'>{cat.name}</td>
              <td className='px-6 py-4 text-sm text-slate-600'>
                {formatDate(cat.created_at)}
              </td>
              <td className='px-6 py-4'>
                <div className='inline-flex space-x-2'>
                  <button
                    onClick={() => onEdit(cat)}
                    className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                    title='Edit category'
                  >
                    <Edit className='w-5 h-5' />
                  </button>
                  <button
                    onClick={() => onDelete(cat)}
                    className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                    title='Delete category'
                  >
                    <Trash className='w-5 h-5' />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CategoryTable