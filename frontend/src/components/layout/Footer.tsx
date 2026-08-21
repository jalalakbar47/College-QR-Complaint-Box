import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  HeartHandshake,
  Lock,
  Github,
  Linkedin,
  Mail,
  Heart,
  Code2,
  PhoneCall,
  PlusCircle,
  Search,
  ExternalLink,
} from 'lucide-react';
import { Pill } from '../ui/Pill';
import { ENV } from '../../config/env';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-hairline mt-auto bg-paper" style={{ backgroundColor: '#EAEDF3' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 space-y-6 sm:space-y-8">
        {/* 3 Balanced Surface-1 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {/* Card 1: Institutional Identity */}
          <div className="bg-paper-card rounded-2xl border border-hairline shadow-sm p-5 sm:p-6 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-registrar-blue/10 border border-registrar-blue/20 flex items-center justify-center text-registrar-blue flex-shrink-0 shadow-2xs">
                  <ShieldCheck className="w-5.5 h-5.5 text-registrar-blue" />
                </div>
                <div className="min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted font-semibold block truncate">
                    {ENV.COLLEGE_SHORT_NAME || 'GPGC KHAR DISTRICT BAJAUR'}
                  </span>
                  <span className="font-sans font-semibold text-ink-navy text-sm sm:text-base leading-tight block truncate">
                    {ENV.PORTAL_TITLE || 'College QR Complaint Box'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-ink-muted leading-relaxed font-sans">
                An institutional student grievance and issue redressal initiative dedicated to maintaining safety, accountability, and academic excellence across campus.
              </p>
            </div>

            <div className="pt-2 border-t border-hairline flex items-center justify-between">
              <Pill
                variant="resolved"
                size="sm"
                label={ENV.IS_LIVE_API_CONFIGURED ? 'Live Cloud Database' : 'Active Local Engine'}
              />
              <span className="font-mono text-[10px] text-ink-muted">v2.0.0</span>
            </div>
          </div>

          {/* Card 2: Student Privacy & Quick Links */}
          <div className="bg-paper-card rounded-2xl border border-hairline shadow-sm p-5 sm:p-6 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-ledger-green/10 border border-ledger-green/20 flex items-center justify-center text-ledger-green flex-shrink-0">
                  <HeartHandshake className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-ink-navy font-semibold block">
                    Student Privacy &amp; Trust
                  </span>
                  <span className="text-[10px] text-ink-muted font-sans">100% Confidential Reporting</span>
                </div>
              </div>

              <p className="text-xs text-ink-muted leading-relaxed font-sans">
                When filing anonymously, zero student IDs or network metadata are stored. Students can report sensitive issues with complete peace of mind.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-hairline">
              <Link
                to="/complaint"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-paper-recessed hover:bg-registrar-blue/10 hover:text-registrar-blue border border-hairline text-xs font-medium text-ink-navy transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>File Issue</span>
              </Link>
              <Link
                to="/track"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-paper-recessed hover:bg-registrar-blue/10 hover:text-registrar-blue border border-hairline text-xs font-medium text-ink-navy transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track Status</span>
              </Link>
            </div>
          </div>

          {/* Card 3: Chief Proctor Desk & Helpline */}
          <div className="bg-paper-card rounded-2xl border border-hairline shadow-sm p-5 sm:p-6 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-registrar-blue/10 border border-registrar-blue/20 flex items-center justify-center text-registrar-blue flex-shrink-0">
                    <Lock className="w-4 h-4 text-registrar-blue" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-ink-navy font-semibold block">
                      Chief Proctor Desk
                    </span>
                    <span className="text-[10px] text-ink-muted font-sans">Office of Campus Discipline</span>
                  </div>
                </div>

                <Link
                  to="/admin/login"
                  className="text-[11px] font-mono text-registrar-blue hover:underline inline-flex items-center gap-1"
                >
                  <span>Staff Login</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-3 rounded-xl bg-paper-recessed border border-hairline space-y-1 text-xs">
                <p className="font-semibold text-ink-navy text-xs">
                  Student Affairs &amp; Discipline Cell
                </p>
                <p className="text-[11px] text-ink-muted truncate font-sans">
                  {ENV.COLLEGE_NAME || 'Government Post Graduate College Khar'}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-hairline flex items-center gap-2 text-xs font-medium text-ink-navy">
              <PhoneCall className="w-3.5 h-3.5 text-registrar-blue flex-shrink-0" />
              <span>Helpline: Proctor Office GPGC Khar District Bajaur</span>
            </div>
          </div>
        </div>

        {/* Distinct Developer Attribution Strip */}
        <div
          className="p-4 sm:p-5 rounded-2xl bg-ink-navy text-white border border-ink-navy shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ backgroundColor: '#101B36' }}
        >
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 text-seal-gold flex items-center justify-center flex-shrink-0">
              <Code2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-200 flex items-center justify-center sm:justify-start gap-1">
                Designed &amp; Built with <Heart className="w-3.5 h-3.5 text-case-red fill-case-red inline mx-0.5" /> by
                <span className="font-semibold text-white ml-0.5">Jalaluddin Khan</span>
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                Software Developer · BS Computer Science · @jalalakbar47 · GPGC Khar Bajaur
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href="https://github.com/jalalakbar47"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
              title="GitHub Profile"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>

            <a
              href="https://linkedin.com/in/jalalakbar47"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>

            <a
              href="mailto:jalalakbarbjr@gmail.com"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
              title="Send Email"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </a>
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="pt-2 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-ink-muted">
          <p>© {new Date().getFullYear()} {ENV.COLLEGE_NAME || 'GPGC Khar District Bajaur'}. All rights reserved.</p>
          <p>Powered by React 18, TypeScript, Vite &amp; Google Apps Script</p>
        </div>
      </div>
    </footer>
  );
};
