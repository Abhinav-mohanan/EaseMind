import React, { useState } from 'react';
import { Calendar, ChevronRight, ClipboardList, HeartPlus, MessageCircle, User, Wallet,ChevronsRight, ChevronsLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const UserSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path;
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      path: '/user/profile',
      label: 'My Profile',
      icon: User,
    },
    {
      path: '/user/appointments',
      label: 'Appointments',
      icon: Calendar,
    },
    {
      path: '/user/consultations',
      label: 'Consultations',
      icon: ClipboardList,
    },
    {
      path: '/user/health-tracking',
      label: 'HealthTracker',
      icon: HeartPlus,
    },
    {
      path: '/user/wallet/transaction',
      label: 'Wallet',
      icon: Wallet,
    },
    {
      path: '/chat',
      label: 'Chat',
      icon: MessageCircle,
    },
  ];

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

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)} 
                className={`group flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                  active
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-textBlue shadow-sm border border-textBlue'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    active ? 'text-textBlue' : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="h-4 w-4 text-textBlue" />}

                {active && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-textBlue to-cyan-500 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default UserSidebar;