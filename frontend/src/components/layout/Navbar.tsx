import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, PlusCircle, Search, Lock, Menu, X, QrCode } from 'lucide-react';
import { ENV } from '../../config/env';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* College Identity & Crest */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 group-hover:shadow-brand-500/40 transition-all duration-300">
                <ShieldCheck className="w-6 h-6 text-brand-100" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-300 animate-pulse" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-700 font-display">
                  {ENV.COLLEGE_SHORT_NAME}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Active Portal
                </span>
              </div>
              <span className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight font-display tracking-tight group-hover:text-brand-700 transition-colors">
                {ENV.PORTAL_TITLE}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/complaint"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                isActive('/complaint')
                  ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/30'
                  : 'text-slate-700 hover:text-brand-700 hover:bg-brand-50/70'
              }`}
            >
              <PlusCircle className={`w-4 h-4 ${isActive('/complaint') ? 'text-white' : 'text-brand-600'}`} />
              <span>Submit Complaint</span>
            </Link>

            <Link
              to="/track"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                isActive('/track')
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Track Complaint</span>
            </Link>

            <div className="h-5 w-px bg-slate-200 mx-2" />

            <Link
              to="/admin/login"
              className="group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-brand-700 bg-slate-50 hover:bg-brand-50/60 border border-slate-200/80 hover:border-brand-200 transition-all shadow-2xs hover:shadow-xs"
            >
              <div className="w-6 h-6 rounded-lg bg-slate-200/70 group-hover:bg-brand-200/60 flex items-center justify-center transition-colors">
                <Lock className="w-3.5 h-3.5 text-slate-600 group-hover:text-brand-700 transition-colors" />
              </div>
              <span>Chief Proctor Login</span>
            </Link>
          </nav>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/admin/login"
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
              title="Chief Proctor Login"
            >
              <Lock className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2 shadow-lg animate-fade-in">
          <Link
            to="/complaint"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold ${
              isActive('/complaint')
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-800 hover:bg-brand-50 hover:text-brand-700'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Submit a Complaint</span>
          </Link>

          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold ${
              isActive('/track')
                ? 'bg-slate-900 text-white'
                : 'text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Track Existing Complaint</span>
          </Link>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            <QrCode className="w-5 h-5 text-brand-600" />
            <span>Campus QR & Portal Home</span>
          </Link>

          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
            >
              <Lock className="w-4 h-4 text-brand-300" />
              <span>Chief Proctor & Admin Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
