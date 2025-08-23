import { Link, useNavigate } from 'react-router-dom';
import { AuthStatusApi, LogoutApi } from '../../api/authApi';
import { toast } from 'react-toastify';
import ErrorHandler from '../Layouts/ErrorHandler';
import { useEffect, useRef, useState } from 'react';
import { LogIn, LogOut, User, UserCircle } from 'lucide-react';
import ConfirmationModal from '../Layouts/Confirmationmodal';

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState();
  const dropdwonRef = useRef();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await AuthStatusApi();
        setIsAuthenticated(data.isAuthenticated);
        setRole(data.role);
        localStorage.setItem('role',data.role)
      } catch (error) {
        setIsAuthenticated(false);
        setRole(null);
      }
    };
    checkAuth();
  }, []);

  const profileRoute = role === 'psychologist' ? '/psychologist/profile' : '/user/profile';

  const handleUserProfile = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setIsModalOpen(true);
  };

  // logout
  const ConfirmLogout = async () => {
    try {
      const data = await LogoutApi();
      toast.success(data.message);
      navigate('/login');
      localStorage.removeItem('role')
    } catch (error) {
      ErrorHandler(error);
      setIsModalOpen(false);
    }
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  // dropdown menu automatically closes when the user clicks outside
  useEffect(() => {
    const handleClickoutside = (event) => {
      if (dropdwonRef.current && !dropdwonRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickoutside); // add eventlistener to check the mouse clicks
    return () => {
      document.removeEventListener('mousedown', handleClickoutside); // cleanup fun
    };
  }, []);

  return (
    <>
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-teal-500">EaseMind</div>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-teal-700">
            Home
          </Link>
          <Link to="/articles" className="text-gray-700 hover:text-teal-700">
            Articles
          </Link>
          <Link to="/therapist" className="text-gray-700 hover:text-teal-700">
            Therapyist
          </Link>
          <Link to="#" className="text-gray-700 hover:text-teal-700">
            Contact us
          </Link>

          <div className="relative" ref={dropdwonRef}>
            <UserCircle
              size={24}
              onClick={handleUserProfile}
              className="text-gray-700 hover:text-green-700 cursor-pointer"
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md z-50 border">
                {isAuthenticated ? (
                  <>
                    <button
                      disabled={!role}
                      onClick={() => navigate(profileRoute)}
                      className="w-full flex items-center gap-3 p-1.5 hover:bg-gray-100 text-gray-700 rounded-lg"
                    >
                      <User className="h-4 w-4" />
                      <span className="text-md">My Profile</span>
                    </button>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-1.5 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-md">Logout</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 text-gray-700 rounded-lg"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="text-md">Login</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        onConfirm={ConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </>
  );
};

export default Navbar;
