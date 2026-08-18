import React from 'react';
import { ShieldCheck, HeartHandshake, Lock } from 'lucide-react';
import { ENV } from '../../config/env';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-900 text-sm">
                {ENV.PORTAL_TITLE}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              An institutional grievance reporting initiative dedicated to maintaining safety, transparent resolution, and academic integrity across campus.
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

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {ENV.COLLEGE_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Powered by React & Google Apps Script</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
