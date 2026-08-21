import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, PlusCircle, Search, Lock, Menu, X, QrCode } from 'lucide-react';
import { Pill } from '../ui/Pill';
import { Button } from '../ui/Button';
import { ENV } from '../../config/env';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-paper-card/90 backdrop-blur-md border-b border-hairline transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-registrar-blue rounded-lg">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-registrar-blue/10 border border-registrar-blue/20 flex items-center justify-center text-registrar-blue flex-shrink-0 transition-colors group-hover:bg-registrar-blue/15">
              <ShieldCheck className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-ink-muted font-medium">
                  {ENV.COLLEGE_SHORT_NAME || 'GPGC KHAR DISTRICT BAJAUR'}
                </span>
                <span className="hidden sm:inline-flex">
                  <Pill variant="resolved" size="sm" label="Active Portal" />
                </span>
              </div>
              <span className="font-sans font-semibold text-ink-navy text-sm sm:text-base leading-tight tracking-tight group-hover:text-registrar-blue transition-colors">
                {ENV.PORTAL_TITLE || 'College QR Complaint Box'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/complaint"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-registrar-blue ${
                isActive('/complaint')
                  ? 'bg-registrar-blue text-white shadow-sm'
                  : 'text-ink-navy hover:text-registrar-blue hover:bg-paper'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Complaint</span>
            </Link>

            <Link
              to="/track"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-registrar-blue ${
                isActive('/track')
                  ? 'bg-ink-navy text-white shadow-sm'
                  : 'text-ink-navy hover:text-registrar-blue hover:bg-paper'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Track Complaint</span>
            </Link>

            <div className="h-5 w-px bg-hairline mx-1.5" />

            <Link to="/admin/login">
              <Button
                variant="secondary"
                size="sm"
                className="text-xs"
                leftIcon={<Lock className="w-3.5 h-3.5 text-ink-muted" />}
              >
                Chief Proctor Login
              </Button>
            </Link>
          </nav>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/admin/login">
              <Button
                variant="secondary"
                size="sm"
                className="p-2 min-h-[36px]"
                aria-label="Chief Proctor Login"
              >
                <Lock className="w-4 h-4 text-ink-navy" />
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-ink-navy bg-paper hover:bg-hairline/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-registrar-blue min-h-[36px]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-hairline bg-paper-card px-4 pt-3 pb-5 space-y-2 shadow-md animate-fade-in">
          <Link
            to="/complaint"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium ${
              isActive('/complaint')
                ? 'bg-registrar-blue text-white shadow-sm'
                : 'text-ink-navy hover:bg-paper'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Submit a Complaint</span>
          </Link>

          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium ${
              isActive('/track')
                ? 'bg-ink-navy text-white'
                : 'text-ink-navy hover:bg-paper'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Track Existing Complaint</span>
          </Link>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-ink-navy hover:bg-paper"
          >
            <QrCode className="w-5 h-5 text-registrar-blue" />
            <span>Campus QR & Portal Home</span>
          </Link>

          <div className="pt-2 border-t border-hairline">
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-3 rounded-lg text-xs font-medium bg-ink-navy text-white hover:bg-ink-navy/90 shadow-sm"
            >
              <Lock className="w-4 h-4 text-seal-gold" />
              <span>Chief Proctor & Admin Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
