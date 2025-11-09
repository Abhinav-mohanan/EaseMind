import { useEffect, useRef, useState } from 'react';
import { Bell, Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { useOnClickOutside } from '../../../Hooks/useOnClickOutside ';
import { ClearAllNotificationsApi, MarkAllAsReadApi } from '../../../api/notificationApi'
import { toast } from 'react-toastify';
import ErrorHandler from '../../Layouts/ErrorHandler';
import ConfirmationModal from '../../Layouts/Confirmationmodal';

const formatDate = (dateString) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const notificationStyles = {
  INFO: {
    icon: Info,
    borderColor: 'border-l-blue-500',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    hoverBg: 'hover:bg-blue-50'
  },
  WARNING: {
    icon: AlertTriangle,
    borderColor: 'border-l-amber-500',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    hoverBg: 'hover:bg-amber-50'
  },
  ERROR: {
    icon: XCircle,
    borderColor: 'border-l-red-500',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    hoverBg: 'hover:bg-red-50'
  },
  SUCCESS: {
    icon: CheckCircle,
    borderColor: 'border-l-green-500',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    hoverBg: 'hover:bg-green-50'
  }
};


const NotificationPanel = ({ notifications, isOpen, setIsOpen, fetchNotifications }) => {
  const panelRef = useRef(null);
  useOnClickOutside(panelRef, () => setIsOpen(false));
  const notificationCount = notifications.length;
  const [filter, setFilter] = useState('unread');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const openModalForAction = (action) => {
    setPendingAction(action);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    try {
      if (pendingAction === 'mark') {
        const data = await MarkAllAsReadApi();
        toast.success(data.message);
        fetchNotifications(filter);
      } else if (pendingAction === 'clear') {
        const data = await ClearAllNotificationsApi();
        toast.success(data.message);
        fetchNotifications(filter);
      }
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsModalOpen(false);
      setPendingAction(null);
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative text-slate-700 hover:text-slate-900 transition-colors duration-200 cursor-pointer"
      >
        <Bell size={24} strokeWidth={2} />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-xs font-semibold text-white shadow-lg ring-2 ring-white">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 max-h-[32rem] bg-white border border-slate-200 shadow-2xl rounded-xl z-50 overflow-hidden">
          <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Notifications</h3>
            
            <div className="flex gap-1 mt-3 bg-white rounded-lg p-1 shadow-sm border border-slate-200">
              <button
                onClick={() => { setFilter('unread'); fetchNotifications('unread'); }}
                className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                  filter === 'unread'
                    ? 'bg-slate-800 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => { setFilter('all'); fetchNotifications('all'); }}
                className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                  filter === 'all'
                    ? 'bg-slate-800 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                All
              </button>
            </div>
          </div>

          {filter === 'unread' && notificationCount > 0 && (
            <div className="px-5 py-2 bg-slate-50 border-b border-slate-200">
              <button
                onClick={() => openModalForAction('mark')}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Mark all as read
              </button>
            </div>
          )}
          
          {filter === 'all' && notificationCount > 0 && (
            <div className="px-5 py-2 bg-slate-50 border-b border-slate-200">
              <button
                onClick={() => openModalForAction('clear')}
                className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                Clear all
              </button>
            </div>
          )}

          <div className="max-h-80 overflow-y-auto">
            {notificationCount > 0 ? (
              <div>
                {notifications.map((n) => {
                  const type = n.notification_type || 'INFO';
                  const style = notificationStyles[type] || notificationStyles.INFO;
                  const IconComponent = style.icon;
                  
                  return (
                    <div
                      key={n.id} 
                      className={`px-5 py-4 border-b border-slate-100 last:border-none ${style.hoverBg} transition-colors duration-150 cursor-pointer group border-l-4 ${style.borderColor}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${style.iconBg} flex items-center justify-center`}>
                          <IconComponent size={16} className={style.iconColor} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors duration-150">
                            {n.message}
                          </p>
                          <span className="inline-flex items-center text-xs text-slate-500 mt-2">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatDate(n.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Bell size={28} className="text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600 text-center">
                  No notifications yet
                </p>
                <p className="text-xs text-slate-500 text-center mt-1">
                  You're all caught up!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={pendingAction === 'mark' ? 'Confirm Mark All as Read' : 'Confirm Clear All'}
        confirmText={pendingAction === 'mark' ? 'Mark All' : 'Clear All'}
        message={pendingAction === 'mark' ? 'Are you sure you want to mark all notifications as read?'
          : 'Are you sure you want to clear all notifications?'
        }
      />
    </div>
  );
};

export default NotificationPanel;