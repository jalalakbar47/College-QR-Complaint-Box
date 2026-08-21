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
} from 'lucide-react';
import { Pill } from '../ui/Pill';
import { ENV } from '../../config/env';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-paper-card border-t border-hairline mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          {/* Col 1: Brand & Status (5 cols) */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-registrar-blue/10 border border-registrar-blue/20 flex items-center justify-center text-registrar-blue flex-shrink-0">
                <ShieldCheck className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted font-medium block">
                  {ENV.COLLEGE_SHORT_NAME || 'GPGC KHAR DISTRICT BAJAUR'}
                </span>
                <span className="font-sans font-semibold text-ink-navy text-base">
                  {ENV.PORTAL_TITLE || 'College QR Complaint Box'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-sm">
              An institutional student grievance and issue redressal initiative dedicated to maintaining safety, accountability, and academic excellence across campus.
            </p>

            <div className="pt-1">
              <Pill
                variant="resolved"
                size="sm"
                label={ENV.IS_LIVE_API_CONFIGURED ? 'Google Apps Script Engine Live' : 'Local Storage Engine Active'}
              />
            </div>
          </div>

          {/* Col 2: Student Privacy (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-ink-navy flex items-center gap-1.5 font-semibold">
              <HeartHandshake className="w-4 h-4 text-ledger-green" />
              <span>Student Privacy</span>
            </h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              When filing anonymously, zero student IDs or network logs are recorded. Students can report sensitive concerns with complete peace of mind.
            </p>

            <div className="pt-2 flex flex-col gap-1.5 text-xs font-medium">
              <Link to="/complaint" className="text-registrar-blue hover:underline flex items-center gap-1">
                <span>• Submit a Complaint</span>
              </Link>
              <Link to="/track" className="text-registrar-blue hover:underline flex items-center gap-1">
                <span>• Track Existing Ticket</span>
              </Link>
            </div>
          </div>

          {/* Col 3: Chief Proctor Office (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-ink-navy flex items-center gap-1.5 font-semibold">
              <Lock className="w-4 h-4 text-ink-navy" />
              <span>Chief Proctor Office</span>
            </h4>
            <div className="p-4 rounded-xl bg-paper border border-hairline space-y-1.5 text-xs text-ink-muted">
              <p className="font-semibold text-ink-navy">
                Office of Student Affairs & Campus Discipline
              </p>
              <p className="text-[11px] text-ink-muted">
                {ENV.COLLEGE_NAME}
              </p>
              <div className="pt-2 border-t border-hairline flex items-center gap-2 text-xs font-medium text-ink-navy">
                <PhoneCall className="w-3.5 h-3.5 text-registrar-blue" />
                <span>Emergency Helpline: Ext. 404 / 405</span>
              </div>
            </div>
          </div>
        </div>

        {/* Distinct Developer Attribution Strip */}
        <div className="mb-6 p-4 sm:p-5 rounded-xl bg-ink-navy text-white border border-ink-navy shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 text-seal-gold flex items-center justify-center flex-shrink-0">
              <Code2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-200 flex items-center justify-center sm:justify-start gap-1">
                Designed & Built with <Heart className="w-3.5 h-3.5 text-case-red fill-case-red inline mx-0.5" /> by
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
        <div className="pt-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-ink-muted">
          <p>© {new Date().getFullYear()} {ENV.COLLEGE_NAME}. All rights reserved.</p>
          <p>Powered by React 18, TypeScript, Vite & Google Apps Script</p>
        </div>
      </div>
    </footer>
  );
};
