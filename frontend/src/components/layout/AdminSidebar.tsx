import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  FolderTree,
  MapPin,
  History,
  QrCode,
  LogOut,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Pill } from '../ui/Pill';
import { useAuth } from '../../contexts/AuthContext';
import { ENV } from '../../config/env';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { logout, admin } = useAuth();

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/complaints', label: 'Complaints', icon: Inbox },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree },
    { to: '/admin/locations', label: 'Locations', icon: MapPin },
    { to: '/admin/activity-log', label: 'Activity Log', icon: History },
    { to: '/admin/settings', label: 'QR Poster & Settings', icon: QrCode },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-navy/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container: Fixed width 256px, ink-navy background */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-ink-navy text-white flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 border-r border-ink-navy/80 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 sm:h-20 px-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-registrar-blue/20 border border-registrar-blue/30 flex items-center justify-center text-seal-gold shadow-sm flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white font-sans">
                PROCTOR ERP
              </h2>
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 truncate max-w-[130px]">
                {ENV.COLLEGE_SHORT_NAME || 'GPGC Khar Distr...'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="px-4 py-3.5 m-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 text-seal-gold font-mono font-semibold flex items-center justify-center text-sm shadow-inner flex-shrink-0">
              {admin?.name?.charAt(0) || 'C'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {admin?.name || 'Chief Proctor'}
              </p>
              <div className="mt-0.5">
                <Pill variant="gold" size="sm" label={admin?.role || 'Chief Proctor'} />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'bg-registrar-blue text-white font-semibold border-l-4 border-seal-gold shadow-sm'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sign Out Footer */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium text-case-red hover:bg-case-red/10 transition-colors"
          >
            <LogOut className="w-4.5 h-4.5 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
