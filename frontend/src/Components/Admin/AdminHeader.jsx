import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  LogOut, 
  User, 
  Bell, 
  ChevronDown,
  Menu
} from 'lucide-react'
import { LogoutApi } from '../../api/authApi'
import { toast } from 'react-toastify'
import ErrorHandler from '../Layouts/ErrorHandler'
import ConfirmationModal from '../Layouts/Confirmationmodal'

const AdminHeader = () => {
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const [isModalOpen,setIsModalOpen] = useState(false)

  const ConfirmLogout = async() =>{
    try{
      const data = await LogoutApi()
      toast.success(data.message)
      navigate('/admin/login')
    }catch(error){
      ErrorHandler(error)
      setIsModalOpen(false)
    }
  }

  const handleLogout = () =>{
    setIsModalOpen(true)
  }

  const onCloseModal = ()=>{
    setIsModalOpen(false)
  }
  
  return (
    <header className="bg-white shadow-lg border-b border-teal-100 p-4 flex justify-between items-center  sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg">
            <Menu className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Manage your platform efficiently</p>
          </div>
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            className="relative p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
          >
            <Bell className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-2 hover:bg-teal-50 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800">Admin User</p>
              <p className="text-xs text-gray-600">Super Admin</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0  w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="p-2">
                <button
                onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-1.5 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {(showDropdown) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowDropdown(false)
          }}
        />
      )}
      <ConfirmationModal
      isOpen={isModalOpen}
      onClose={onCloseModal}
      onConfirm={ConfirmLogout}
      title='Confirm Logout'
      message='Are you sure you want to logout ?'
      confirmText='Logout'
      cancelText='Cancel'
      />
    </header>
  )
}

export default AdminHeader