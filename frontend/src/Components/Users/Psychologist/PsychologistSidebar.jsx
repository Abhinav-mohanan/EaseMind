import React, { useState } from 'react';
import { BookOpen, Calendar, ChevronRight, ChevronsLeft, ChevronsRight, ClipboardList, Lock, MessageCircle, NotebookPen, User, Wallet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const PsychologistSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem,setHoveredItem] = useState(null)
  
  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isVerified = localStorage.getItem('is_verified') === 'true'
  console.log(isVerified,'dd')

  const menuItems = [
    {
      path: '/psychologist/profile',
      label: 'My Profile',
      icon: User,
      requiresVerification:false
    },
    {
      path: '/psychologist/availability',
      label: 'Availbilitly',
      icon: NotebookPen,
      requiresVerification:true
    },
    {
      path: '/psychologist/appointments/',
      label: 'Appointments',
      icon: Calendar,
      requiresVerification:true,
    },
    {
      path:'/psychologist/consultations',
      label: 'Consultations',
      icon: ClipboardList,
      requiresVerification:true,
    },
    {
      path:'/psychologist/articles',
      label: 'Articles',
      icon: BookOpen,
      requiresVerification:true,
    },
    {
      path:'/psychologist/wallet/transaction',
      label: 'My Earnings',
      icon: Wallet,
      requiresVerification:true,
    },
    {
      path:'/chat',
      label: 'Chat',
      icon: MessageCircle,
      requiresVerification:true,
    }
  ];

  const handleMenuClick = (e,item) =>{
    const isDisabled = item.requiresVerification && !isVerified;
    if (isDisabled){
      e.preventDefault();
      return
    }
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={toggleSidebar}
        className={`lg:hidden fixed left-4 top-20 z-50 bg-textBlue text-white p-2 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'translate-x-64' : 'translate-x-0'
        }`}
      >
        {isOpen ? (
          <ChevronsLeft className="h-5 w-5" />
        ) : (
          <ChevronsRight className="h-5 w-5" />
        )}
      </button>
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className={`fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const isDisabled = item.path !== '/psychologist/profile' && !isVerified

            return (
              <div 
                key={item.path}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  to={isDisabled ? '#' : item.path}
                  onClick={(e) => handleMenuClick(e, item)}
                  className={`group flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    active && !isDisabled
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-textBlue shadow-sm border border-textBlue'
                      : isDisabled
                      ? 'text-gray-400 cursor-not-allowed opacity-60'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      active && !isDisabled 
                        ? 'text-textBlue' 
                        : isDisabled
                        ? 'text-gray-300'
                        : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  <span className="flex-1">{item.label}</span>
                  
                  {isDisabled && <Lock className="h-4 w-4 text-gray-300" />}
                  {active && !isDisabled && <ChevronRight className="h-4 w-4 text-textBlue" />}

                  {active && !isDisabled && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-textBlue to-cyan-500 rounded-r-full" />
                  )}
                </Link>
                {isDisabled && hoveredItem === item.path && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 shadow-lg">
                    <div className="flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Verification required
                    </div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default PsychologistSidebar;
