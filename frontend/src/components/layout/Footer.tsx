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
import { ENV } from '../../config/env';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          {/* Col 1: Institutional Portal Info (5 cols) */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-700 block font-display">
                  {ENV.COLLEGE_SHORT_NAME}
                </span>
                <span className="font-extrabold text-slate-900 text-base font-display">
                  {ENV.PORTAL_TITLE}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
              An institutional student grievance and issue redressal initiative dedicated to maintaining safety, accountability, and academic excellence across campus.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{ENV.IS_LIVE_API_CONFIGURED ? 'Google Apps Script Engine Live' : 'Local Storage Engine Active'}</span>
            </div>
          </div>

          {/* Col 2: Quick Links & Protection Pledge (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 font-display">
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              <span>Student Privacy</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              When filing anonymously, zero student IDs or IP addresses are recorded in database logs. Students can report sensitive concerns with complete peace of mind.
            </p>

            <div className="pt-2 flex flex-col gap-1.5 text-xs font-semibold text-brand-700">
              <Link to="/complaint" className="hover:underline flex items-center gap-1">
                <span>• Submit a New Complaint</span>
              </Link>
              <Link to="/track" className="hover:underline flex items-center gap-1">
                <span>• Track Existing Ticket</span>
              </Link>
            </div>
          </div>

          {/* Col 3: Chief Proctor Office (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 font-display">
              <Lock className="w-4 h-4 text-slate-800" />
              <span>Chief Proctor Office</span>
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
              <p className="font-bold text-slate-800">
                Office of Student Affairs & Campus Discipline
              </p>
              <p className="text-[11px] text-slate-500">
                {ENV.COLLEGE_NAME}
              </p>
              <div className="pt-2 border-t border-slate-200/80 flex items-center gap-2 text-xs font-semibold text-slate-800">
                <PhoneCall className="w-3.5 h-3.5 text-brand-600" />
                <span>Emergency Helpline: Ext. 404 / 405</span>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Attribution Card */}
        <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-brand-950 text-white border border-slate-800 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/20 border border-brand-400/30 text-brand-300 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center justify-center sm:justify-start gap-1">
                Designed & Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" /> by
                <span className="font-extrabold text-white ml-0.5">Jalaluddin Khan</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Software Developer • BS Computer Science • @jalalakbar47 • GPGC Khar Bajaur
              </p>
            </div>
          </div>

          {/* Developer Social Links */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/jalalakbar47"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-800/90 hover:bg-slate-700 hover:text-white border border-slate-700/80 transition-all hover:scale-105 shadow-xs"
              title="GitHub Profile"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>

            <a
              href="https://linkedin.com/in/jalalakbar47"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-sky-300 bg-sky-950/60 hover:bg-sky-900/80 hover:text-white border border-sky-600/40 transition-all hover:scale-105 shadow-xs"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-3.5 h-3.5 text-sky-400" />
              <span>LinkedIn</span>
            </a>

            <a
              href="mailto:jalalakbarbjr@gmail.com"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 hover:text-white border border-emerald-600/40 transition-all hover:scale-105 shadow-xs"
              title="Send Email"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>Contact</span>
            </a>
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {ENV.COLLEGE_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Powered by React 18, TypeScript, Vite & Google Apps Script</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
