import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
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
import { Pill } from '../ui/Pill';
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
  title = 'Proctor & Admin Overview',
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

  const getPriorityPillVariant = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'critical';
      case 'High':
        return 'in-progress';
      case 'Medium':
        return 'new';
      case 'Low':
      default:
        return 'neutral';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-paper-card border-b border-hairline h-16 sm:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-ink-navy hover:bg-paper focus:outline-none"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-serif text-base sm:text-xl font-normal text-ink-navy leading-tight">
            {title}
          </h1>
          <p className="hidden sm:block font-mono text-[10px] sm:text-[11px] text-ink-muted uppercase tracking-wider">
            {ENV.COLLEGE_NAME || 'Government Post Graduate College Khar District Bajaur'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Real-time Notification Bell & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative p-2 rounded-lg transition-colors ${
              isOpen
                ? 'bg-registrar-blue/10 text-registrar-blue ring-2 ring-registrar-blue/20'
                : 'text-ink-muted hover:text-ink-navy hover:bg-paper'
            }`}
            title="Complaint Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-mono font-bold text-white bg-case-red rounded-full shadow-sm">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Flyout Notification Panel */}
          {isOpen && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-paper-card rounded-xl shadow-lg border border-hairline overflow-hidden z-50 animate-fade-in">
              {/* Header */}
              <div className="px-4 py-3 bg-ink-navy text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">Complaint Alerts</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-mono font-bold bg-case-red text-white px-2 py-0.5 rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {/* Sound Toggle */}
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                    title={soundEnabled ? 'Mute Alert Chime' : 'Unmute Alert Chime'}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-ledger-green" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                  </button>

                  {/* Desktop Notification Request */}
                  {desktopPermission !== 'granted' && (
                    <button
                      onClick={requestDesktopPermission}
                      className="p-1.5 rounded-lg text-seal-gold hover:text-white hover:bg-white/10 transition-colors"
                      title="Enable Desktop Push Alerts"
                    >
                      <BellRing className="w-4 h-4" />
                    </button>
                  )}

                  {/* Mark All Read */}
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Real-time Status Bar */}
              <div className="px-4 py-2 bg-paper border-b border-hairline flex items-center justify-between text-[11px] text-ink-muted">
                <span className="flex items-center gap-1.5 font-medium text-ink-navy">
                  <span className="w-2 h-2 rounded-full bg-ledger-green animate-pulse inline-block" />
                  Live complaint sync active
                </span>
                <span className="text-[10px] font-mono text-ink-muted">12s auto-refresh</span>
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-hairline">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-ink-muted">
                    <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-ink-muted/50 stroke-1" />
                    <p className="text-xs font-semibold text-ink-navy">All caught up!</p>
                    <p className="text-[11px] text-ink-muted mt-0.5">No complaint alerts recorded yet.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n.complaint_id, n.id)}
                      className={`p-3.5 transition-colors cursor-pointer hover:bg-paper flex items-start gap-3 ${
                        !n.is_read ? 'bg-registrar-blue/5' : ''
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {!n.is_read ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-registrar-blue inline-block ring-4 ring-registrar-blue/15" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-hairline inline-block" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Pill
                            variant={getPriorityPillVariant(n.priority) as any}
                            size="sm"
                            label={n.priority}
                          />
                          <span className="text-[10px] font-semibold text-ink-muted truncate max-w-[120px]">
                            {n.category}
                          </span>
                          <span className="ml-auto text-[10px] font-mono text-ink-muted flex items-center gap-0.5 whitespace-nowrap">
                            <Clock className="w-2.5 h-2.5" />
                            {formatRelativeTime(n.timestamp)}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-ink-navy line-clamp-1 leading-snug">{n.title}</p>

                        <div className="flex items-center justify-between text-[11px] text-ink-muted mt-1">
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-2.5 h-2.5 text-ink-muted flex-shrink-0" />
                            <span className="truncate">{n.location}</span>
                          </span>
                          <span className="font-mono text-[10px] font-semibold text-registrar-blue flex-shrink-0">
                            {n.complaint_id}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-ink-muted self-center flex-shrink-0" />
                    </div>
                  ))
                )}
              </div>

              {/* Footer Actions */}
              {notifications.length > 0 && (
                <div className="p-2.5 bg-paper border-t border-hairline flex items-center justify-between text-xs">
                  <button
                    onClick={clearAll}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-muted hover:text-case-red transition-colors px-2 py-1 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear list</span>
                  </button>

                  <Link
                    to="/admin/complaints"
                    onClick={() => setIsOpen(false)}
                    className="font-medium text-registrar-blue hover:underline text-[11px] px-2 py-1"
                  >
                    View repository →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Student Portal External Link Pill */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center"
          title="Open Public Student Portal in new tab"
        >
          <Pill variant="new" size="sm" label="Student Portal ↗" />
        </a>

        {/* Admin Avatar + Name / Role */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-hairline">
          <div className="w-8 h-8 rounded-full bg-ink-navy text-white font-mono font-semibold flex items-center justify-center text-xs shadow-xs">
            {admin?.name?.charAt(0) || 'C'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-ink-navy leading-none">{admin?.name || 'Chief Proctor'}</p>
            <span className="text-[10px] font-mono text-ink-muted leading-none block mt-0.5">{admin?.role || 'Administrator'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
