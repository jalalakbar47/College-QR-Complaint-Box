import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, PlusCircle, Search, Lock, Menu, X, QrCode } from 'lucide-react';
import { ENV } from '../../config/env';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & College Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-brand-700">
                {ENV.COLLEGE_SHORT_NAME} Portal
              </span>
              <span className="block text-sm sm:text-base font-bold text-slate-900 leading-tight">
                {ENV.PORTAL_TITLE}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <Link
              to="/complaint"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive('/complaint')
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-brand-600" />
              <span>Submit Complaint</span>
            </Link>

            <Link
              to="/track"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive('/track')
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Track Complaint</span>
            </Link>

            <div className="h-5 w-px bg-slate-200 mx-2" />

            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-slate-200/60"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/admin/login"
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg"
              title="Admin Login"
            >
              <Lock className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-fade-in">
          <Link
            to="/complaint"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium ${
              isActive('/complaint') ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <PlusCircle className="w-5 h-5 text-brand-600" />
            <span>Submit a Complaint</span>
          </Link>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium ${
              isActive('/track') ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Search className="w-5 h-5 text-slate-500" />
            <span>Track Existing Complaint</span>
          </Link>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <QrCode className="w-5 h-5 text-slate-500" />
            <span>Campus QR & Portal Home</span>
          </Link>
          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              <Lock className="w-4 h-4" />
              <span>Proctor & Admin Login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
