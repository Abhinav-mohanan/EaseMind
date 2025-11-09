import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User } from 'lucide-react';
import { useOnClickOutside } from '../../../Hooks/useOnClickOutside ';

const ProfileDropdown = ({ isAuthenticated, role, onLogout }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const profileRoute = role === 'psychologist' ? '/psychologist/profile' : '/user/profile';

  return (
    <div className="relative" ref={dropdownRef}>
      <User
        size={24}
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-customBlue hover:text-green-700 cursor-pointer"
      />
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md z-50 border p-2">
          {isAuthenticated ? (
            <>
              <Link to={profileRoute} disabled={!role} className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 text-gray-700 rounded-lg">
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </Link>
              <button onClick={onLogout} className="w-full flex items-center gap-3 p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/login')} className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 text-gray-700 rounded-lg">
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;