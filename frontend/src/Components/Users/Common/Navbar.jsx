import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Menu, X } from 'lucide-react';
import { LogoutApi } from '../../../api/authApi';
import ErrorHandler from '../../Layouts/ErrorHandler';
import { useAuth } from '../../../Hooks/useAuth'
import { useNotifications } from '../../../Hooks/UseNotifications'
import NavLinks from './NavLinks';
import ProfileDropdown from './ProfileDropdown';
import NotificationPanel from './NotificationPanel ';
import ConfirmationModal from '../../Layouts/ConfirmationModal';

const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, role,loading } = useAuth()
  const{notifications,fetchNotifications} = useNotifications(isAuthenticated)
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menubarOpen, setMenubarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const data = await LogoutApi();
      toast.success(data.message);
      localStorage.removeItem('role');
      localStorage.removeItem('is_verified');
      navigate('/login');
      window.location.reload(); 
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsModalOpen(false);
    }
  };
  
  if (loading) {
    return <div className="h-16 bg-white shadow-md"></div>;
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md px-4 py-3 flex items-center justify-between h-16 z-50">
        <div className="text-2xl font-bold text-customBlue">EaseMind</div>
        <div className="hidden md:flex space-x-6 absolute left-1/2 transform -translate-x-1/2">
          <NavLinks />
        </div>
        <div className="flex items-center gap-5">
          {isAuthenticated && (
            <NotificationPanel 
              notifications={notifications} 
              isOpen={isNotificationOpen} 
              setIsOpen={setIsNotificationOpen} 
              fetchNotifications={fetchNotifications}
            />
          )}
          <ProfileDropdown
            isAuthenticated={isAuthenticated}
            role={role}
            onLogout={() => setIsModalOpen(true)}
          />
          <button
            className="md:hidden text-customBlue"
            onClick={() => setMenubarOpen(!menubarOpen)}
          >
            {menubarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      {menubarOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md border-t flex flex-col space-y-4 p-4 z-40">
          <NavLinks linkClassName="text-gray-700 font-medium hover:text-customBlue p-2" />
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        confirmText='Logout'
        message="Are you sure you want to log out?"
      />
    </>
  );
};

export default Navbar;