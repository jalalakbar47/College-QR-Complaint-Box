import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  ExternalLink,
  Bell,
  Volume2,
  VolumeX,
  BellRing,
  CheckCheck,
  Trash2,
  MapPin,
  Clock,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { ENV } from '../../config/env';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  title?: string;
}

function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 45) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  title = 'Proctor & Admin Dashboard',
}) => {
  const { admin } = useAuth();
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    soundEnabled,
    setSoundEnabled,
    desktopPermission,
    requestDesktopPermission,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (complaintId: string, notifId: string) => {
    markAsRead(notifId);
    setIsOpen(false);
    navigate(`/admin/complaints/${complaintId}`);
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Low':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs h-16 sm:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-base sm:text-xl font-bold text-slate-900 leading-tight">{title}</h1>
          <p className="hidden sm:block text-xs text-slate-500">{ENV.COLLEGE_NAME}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Real-time Notification Bell & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative p-2 sm:p-2.5 rounded-xl transition-all ${
              isOpen
                ? 'bg-brand-50 text-brand-600 ring-2 ring-brand-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Complaint Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full shadow-sm animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Flyout Notification Panel */}
          {isOpen && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white rounded-2xl shadow-elevated border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Header */}
              <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">Complaint Alerts</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {/* Sound Toggle */}
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    title={soundEnabled ? 'Mute Alert Chime' : 'Unmute Alert Chime'}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                  </button>

                  {/* Desktop Notification Request */}
                  {desktopPermission !== 'granted' && (
                    <button
                      onClick={requestDesktopPermission}
                      className="p-1.5 rounded-lg text-amber-300 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Enable Desktop Push Alerts"
                    >
                      <BellRing className="w-4 h-4" />
                    </button>
                  )}

                  {/* Mark All Read */}
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Real-time Status Bar */}
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  Live complaint sync active
                </span>
                <span className="text-[10px] text-slate-400">12s auto-refresh</span>
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-1" />
                    <p className="text-xs font-semibold text-slate-600">All caught up!</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">No complaint alerts recorded yet.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n.complaint_id, n.id)}
                      className={`p-3.5 transition-colors cursor-pointer hover:bg-slate-50 flex items-start gap-3 ${
                        !n.is_read ? 'bg-brand-50/40' : ''
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {!n.is_read ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-brand-600 inline-block ring-4 ring-brand-100" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${getPriorityBadgeClass(
                              n.priority
                            )}`}
                          >
                            {n.priority}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-600 truncate max-w-[120px]">
                            {n.category}
                          </span>
                          <span className="ml-auto text-[10px] text-slate-400 flex items-center gap-0.5 whitespace-nowrap">
                            <Clock className="w-2.5 h-2.5" />
                            {formatRelativeTime(n.timestamp)}
                          </span>
                        </div>

                        <p className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">{n.title}</p>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                          <span className="flex items-center gap-1 truncate text-slate-500">
                            <MapPin className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{n.location}</span>
                          </span>
                          <span className="font-mono text-[10px] font-medium text-brand-700 flex-shrink-0">
                            {n.complaint_id}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-300 self-center flex-shrink-0" />
                    </div>
                  ))
                )}
              </div>

              {/* Footer Actions */}
              {notifications.length > 0 && (
                <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={clearAll}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-rose-600 transition-colors px-2 py-1 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear list</span>
                  </button>

                  <Link
                    to="/admin/complaints"
                    onClick={() => setIsOpen(false)}
                    className="font-semibold text-brand-700 hover:text-brand-800 text-[11px] px-2 py-1 rounded hover:bg-brand-50"
                  >
                    View repository →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors"
        >
          <span>Student Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-none">{admin?.name}</p>
            <span className="text-[10px] text-slate-500 leading-none">{admin?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
