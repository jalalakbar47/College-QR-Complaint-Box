import React from 'react';
import { Menu, ExternalLink, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ENV } from '../../config/env';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  title?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  title = 'Proctor & Admin Dashboard',
  onRefresh,
  isRefreshing = false,
}) => {
  const { admin } = useAuth();

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
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Refresh Data"
            aria-label="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-600' : ''}`} />
          </button>
        )}

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
