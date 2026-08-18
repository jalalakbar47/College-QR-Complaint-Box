import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, AlertTriangle } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';

export const QuickActionCard: React.FC = () => {
  return (
    <Card>
      <CardHeader
        title="Proctor Quick Actions"
        subtitle="Common administrative shortcuts & campus notices"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          to="/admin/settings"
          className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-brand-50 hover:border-brand-200 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-600 shadow-subtle group-hover:scale-105 transition-transform">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-bold text-slate-900 text-xs">Print QR Notice Posters</h5>
            <p className="text-[11px] text-slate-500">Generate printable flyers for campus gates & hostels</p>
          </div>
        </Link>

        <Link
          to="/admin/complaints?priority=Critical"
          className="flex items-center gap-3 p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 hover:border-rose-300 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-rose-200 flex items-center justify-center text-rose-600 shadow-subtle group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-bold text-slate-900 text-xs">Critical Priority Review</h5>
            <p className="text-[11px] text-slate-500">Filter security, ragging, or emergency hazards</p>
          </div>
        </Link>
      </div>
    </Card>
  );
};
