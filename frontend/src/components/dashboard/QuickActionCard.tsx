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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Link
          to="/admin/settings"
          className="flex items-center gap-3.5 p-4 rounded-xl border border-hairline bg-paper hover:bg-paper-card hover:border-registrar-blue hover:shadow-md transition-all duration-150 group"
        >
          <div className="w-10 h-10 rounded-lg bg-paper-card border border-hairline flex items-center justify-center text-registrar-blue shadow-2xs group-hover:bg-registrar-blue/10 transition-colors flex-shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-semibold text-ink-navy text-xs sm:text-sm group-hover:text-registrar-blue transition-colors">
              Print QR Notice Posters
            </h5>
            <p className="text-[11px] text-ink-muted mt-0.5">
              Generate printable flyers for campus gates, labs & hostels
            </p>
          </div>
        </Link>

        <Link
          to="/admin/complaints?priority=Critical"
          className="flex items-center gap-3.5 p-4 rounded-xl border border-case-red/20 bg-case-red/5 hover:bg-paper-card hover:border-case-red hover:shadow-md transition-all duration-150 group"
        >
          <div className="w-10 h-10 rounded-lg bg-paper-card border border-case-red/30 flex items-center justify-center text-case-red shadow-2xs group-hover:bg-case-red/10 transition-colors flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-semibold text-ink-navy text-xs sm:text-sm group-hover:text-case-red transition-colors">
              Critical Priority Review
            </h5>
            <p className="text-[11px] text-ink-muted mt-0.5">
              Filter safety, ragging, or emergency hazards immediately
            </p>
          </div>
        </Link>
      </div>
    </Card>
  );
};
