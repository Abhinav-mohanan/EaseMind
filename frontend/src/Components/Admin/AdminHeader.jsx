import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, ChevronDown,Menu} from 'lucide-react'
import { LogoutApi } from '../../api/authApi'
import { toast } from 'react-toastify'
import ErrorHandler from '../Layouts/ErrorHandler'
import ConfirmationModal from '../Layouts/Confirmationmodal'
import NotificationPanel from '../Users/Common/NotificationPanel '
import { useNotifications } from '../../Hooks/UseNotifications'

const AdminHeader = () => {
  const navigate = useNavigate()
  const{notifications,fetchNotifications} = useNotifications(true)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isModalOpen,setIsModalOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

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
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md px-4 py-3 flex items-center justify-between h-16 z-50">
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

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <NotificationPanel
        notifications={notifications}
        isOpen={isNotificationOpen}
        setIsOpen={setIsNotificationOpen}
        fetchNotifications={fetchNotifications}/>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-2 hover:bg-teal-50 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800">Admin</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

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