import React from 'react';
import { BookOpen, Calendar, ChevronRight, MessageCircle, NotebookPen, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const PsychologistSidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const menuItems = [
    {
      path: '/psychologist/profile',
      label: 'My Profile',
      icon: User,
    },
    {
      path: '/psychologist/availability',
      label: 'Availbilitly',
      icon: NotebookPen,
    },
    {
      path: '/psychologist/appointments/',
      label: 'Appointments',
      icon: Calendar,
    },
    {
      path:'/psychologist/articles',
      label: 'Articles',
      icon: BookOpen,
    },
    {
      path:'/chat',
      label: 'Chat',
      icon: MessageCircle,
    }
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 shadow-lg fixed z-50">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              EaseMind
            </h2>
            <p className="text-xs text-gray-500 font-medium">Psychologist sidebar</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                active
                  ? 'bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 shadow-sm border border-teal-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-colors ${
                  active ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-600'
                }`}
              />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="h-4 w-4 text-teal-600" />}

              {/* Active indicator */}
              {active && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default PsychologistSidebar;
