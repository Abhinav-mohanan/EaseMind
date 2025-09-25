import { Link, useNavigate } from 'react-router-dom';
import { AuthStatusApi, LogoutApi } from '../../api/authApi';
import { toast } from 'react-toastify';
import ErrorHandler from '../Layouts/ErrorHandler';
import { useEffect, useRef, useState } from 'react';
import { ChevronsRight, LogIn, LogOut, Menu, User, X } from 'lucide-react';
import ConfirmationModal from '../Layouts/Confirmationmodal';

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState();
  const dropdwonRef = useRef();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [menubarOpen,setMenubarOpen] = useState(false)

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
  useEffect(() => {
    const handleClickoutside = (event) => {
      if (dropdwonRef.current && !dropdwonRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickoutside); 
    return () => {
      document.removeEventListener('mousedown', handleClickoutside); 
    };
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md px-4 py-3 flex items-center justify-between h-16 z-50">
        <div className="text-2xl font-bold text-customBlue">EaseMind</div>
        <div className="hidden md:flex space-x-6 absolute left-1/2 transform -translate-x-1/2 ">
          <Link to="/" className="text-gray-700 font-medium  hover:text-customBlue">
            Home
          </Link>
          <Link to="/articles" className="text-gray-700 font-medium hover:text-customBlue">
            Articles
          </Link>
          <Link to="/therapist" className="text-gray-700 font-medium hover:text-customBlue">
            Therapist
          </Link>
          <Link to="#" className="text-gray-700 font-medium hover:text-customBlue">
            About
          </Link>
          <Link to="#" className="text-gray-700 font-medium hover:text-customBlue">
            Contact
          </Link>
           </div>
           <div className='flex items-center'>

          <div className="relative" ref={dropdwonRef}>
            <User
              size={24}
              onClick={handleUserProfile}
              className="text-customBlue hover:text-green-700 cursor-pointer mr-5"
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
          <button
          className='md:hidden text-customBlue'
          onClick={()=>setMenubarOpen(!menubarOpen)}>
            {menubarOpen? <X className='h-4 w-4'/>:<Menu className='h-4 w-4'/>}
          </button>
        </div>
        {menubarOpen&&(
          <div className='absolute top-16 left-0 w-full bg-white shadow-md border-t flex flex-col space-y-4 p-4 md:hidden z-40'>
            <Link to="/" className="text-gray-700 font-medium hover:text-customBlue">
              Home
            </Link>
            <Link to="/articles" className="text-gray-700 font-medium hover:text-customBlue">
              Articles
            </Link>
            <Link to="/therapist" className="text-gray-700 font-medium hover:text-customBlue">
              Therapist
            </Link>
            <Link to="#" className="text-gray-700 font-medium hover:text-customBlue">
              About
            </Link>
            <Link to="#" className="text-gray-700 font-medium hover:text-customBlue">
              Contact
            </Link>
          </div>
        )}
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
