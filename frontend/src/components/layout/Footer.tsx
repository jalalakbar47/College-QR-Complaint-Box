import React from 'react';
import {
  ShieldCheck,
  HeartHandshake,
  Lock,
  Github,
  Linkedin,
  Mail,
  Heart,
  Code2,
} from 'lucide-react';
import { ENV } from '../../config/env';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Col 1: Portal Overview */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-900 text-sm">
                {ENV.PORTAL_TITLE}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              An institutional complaint reporting initiative dedicated to maintaining safety, transparent resolution, and academic integrity across campus.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span>{ENV.IS_LIVE_API_CONFIGURED ? 'Connected to Google Apps Script' : 'Local Development Mock Mode Active'}</span>
            </div>
          </div>

          {/* Col 2: Institutional Privacy Pledge */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-brand-600" />
              Anonymous Guarantee
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              When submitting anonymously, no name, student ID, or personal data is collected or stored in Google Sheets. Students can report sensitive concerns with complete peace of mind.
            </p>
          </div>

          {/* Col 3: Chief Proctor Office */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-slate-700" />
              Chief Proctor Office
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Office of Student Affairs & Campus Discipline<br />
              {ENV.COLLEGE_NAME}<br />
              Emergency Helpline: Ext. 404 / 405
            </p>
          </div>
        </div>

        {/* Developer Attribution Card */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-brand-400 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800 flex items-center justify-center sm:justify-start gap-1">
                Designed & Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> by
                <span className="font-bold text-slate-900 ml-0.5">Jalaluddin Khan</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Software Developer • BS Computer Science • @jalalakbar47
              </p>
            </div>
          </div>

          {/* Developer Social Links */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/jalalakbar47"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-xs transition-all hover:scale-105"
              title="GitHub Profile"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>

            <a
              href="https://linkedin.com/in/jalalakbar47"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 shadow-xs transition-all hover:scale-105"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-3.5 h-3.5 text-blue-600" />
              <span>LinkedIn</span>
            </a>

            <a
              href="mailto:jalalakbarbjr@gmail.com"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 bg-white hover:bg-emerald-50 border border-emerald-200 shadow-xs transition-all hover:scale-105"
              title="Send Email"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              <span>Contact</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {ENV.COLLEGE_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Powered by React, TypeScript & Google Apps Script</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
