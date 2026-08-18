import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Printer, HeartHandshake } from 'lucide-react';
import { Button } from '../ui/Button';
import { ENV } from '../../config/env';

export interface PrintableQRCardProps {
  locationName?: string;
  complaintUrl?: string;
}

export const PrintableQRCard: React.FC<PrintableQRCardProps> = ({
  locationName = 'General Campus',
  complaintUrl = typeof window !== 'undefined' ? `${window.location.origin}/complaint` : 'http://localhost:3000/complaint',
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end no-print">
        <Button
          variant="primary"
          onClick={handlePrint}
          leftIcon={<Printer className="w-4 h-4" />}
        >
          Print Institutional Poster
        </Button>
      </div>

      {/* Printable Poster Container */}
      <div
        id="printable-poster"
        className="bg-white border-4 border-slate-900 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xl text-slate-900 print:border-4 print:shadow-none print:m-0 print:p-8"
      >
        {/* Header Institution Emblem */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-700 text-white flex items-center justify-center mb-3 shadow-md">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-slate-900">
            {ENV.COLLEGE_NAME}
          </h2>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-700 mt-1">
            Office of the Chief Proctor • Grievance Cell
          </p>
        </div>

        {/* Location Badge */}
        <div className="inline-block bg-slate-900 text-white text-xs sm:text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
          Location: {locationName}
        </div>

        {/* Big QR Code */}
        <div className="flex justify-center mb-6">
          <div className="p-5 bg-white rounded-3xl border-4 border-slate-900 shadow-lg inline-block">
            <QRCodeSVG
              value={complaintUrl}
              size={240}
              level="H"
              includeMargin={false}
            />
          </div>
        </div>

        {/* Call to Action */}
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          SCAN TO REPORT AN ISSUE
        </h3>
        <p className="text-sm font-medium text-slate-600 max-w-md mx-auto mb-6">
          Have an issue regarding infrastructure, academics, harassment, cleanliness, or security? Scan with your phone camera to submit a direct complaint to the Chief Proctor.
        </p>

        {/* Steps */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-100 border border-slate-300 text-left mb-6">
          <div>
            <span className="font-extrabold text-brand-700 text-lg block mb-0.5">1</span>
            <span className="text-xs font-bold text-slate-800 block">Scan Code</span>
            <span className="text-[11px] text-slate-500">Open mobile camera</span>
          </div>
          <div>
            <span className="font-extrabold text-brand-700 text-lg block mb-0.5">2</span>
            <span className="text-xs font-bold text-slate-800 block">Describe Issue</span>
            <span className="text-[11px] text-slate-500">Anonymous or named</span>
          </div>
          <div>
            <span className="font-extrabold text-brand-700 text-lg block mb-0.5">3</span>
            <span className="text-xs font-bold text-slate-800 block">Track Status</span>
            <span className="text-[11px] text-slate-500">Get Reference ID</span>
          </div>
        </div>

        {/* Anonymity Assurance Footer */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700">
          <HeartHandshake className="w-4 h-4 text-emerald-600" />
          <span>100% Anonymous & Confidential Reporting Guaranteed</span>
        </div>
      </div>
    </div>
  );
};
