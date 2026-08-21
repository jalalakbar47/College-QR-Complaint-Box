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
          className="shadow-md"
        >
          Print Institutional Poster
        </Button>
      </div>

      {/* Printable Poster Container */}
      <div
        id="printable-poster"
        className="bg-white border-4 border-slate-900 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xl text-slate-900 print:border-4 print:shadow-none print:m-0 print:p-10 print:max-w-full flex flex-col items-center"
      >
        {/* Header Institution Emblem */}
        <div className="flex flex-col items-center mb-5 print:mb-5 w-full">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-700 text-white flex items-center justify-center mb-3 shadow-md">
            <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-slate-900 leading-tight text-center max-w-lg">
            {ENV.COLLEGE_NAME}
          </h2>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-700 mt-1.5">
            Office of the Chief Proctor • Complaint Redressal Cell
          </p>

          {/* Location Badge */}
          <div className="inline-block bg-slate-900 text-white text-xs sm:text-sm font-extrabold uppercase tracking-widest px-5 py-1.5 rounded-full mt-3.5 shadow-sm">
            Location: {locationName}
          </div>
        </div>

        {/* Big High-Impact QR Code */}
        <div className="flex flex-col items-center my-3 print:my-2 w-full">
          <div className="p-4 sm:p-5 bg-white rounded-3xl border-4 border-slate-900 shadow-xl inline-block">
            <QRCodeSVG
              value={complaintUrl}
              size={255}
              level="H"
              includeMargin={false}
            />
          </div>

          {/* Call to Action */}
          <h3 className="text-2xl sm:text-3xl print:text-3xl font-black text-slate-900 tracking-tight uppercase mt-5 mb-1.5">
            SCAN TO REPORT AN ISSUE
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-md mx-auto text-center">
            Point your smartphone camera to file a direct complaint to the Chief Proctor.
          </p>
        </div>

        {/* 3 Step Instruction Guide */}
        <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-100 border border-slate-300 text-left w-full max-w-lg mt-3">
          <div className="border-r border-slate-200 pr-2">
            <span className="font-black text-brand-700 text-sm sm:text-base block leading-none mb-0.5">1. Scan</span>
            <span className="text-[11px] font-bold text-slate-900 block">Open Camera</span>
            <span className="text-[10px] text-slate-500 leading-tight block">Point at QR code</span>
          </div>
          <div className="border-r border-slate-200 pr-2">
            <span className="font-black text-brand-700 text-sm sm:text-base block leading-none mb-0.5">2. Report</span>
            <span className="text-[11px] font-bold text-slate-900 block">Describe Issue</span>
            <span className="text-[10px] text-slate-500 leading-tight block">Anonymous or named</span>
          </div>
          <div>
            <span className="font-black text-brand-700 text-sm sm:text-base block leading-none mb-0.5">3. Track</span>
            <span className="text-[11px] font-bold text-slate-900 block">Live Progress</span>
            <span className="text-[10px] text-slate-500 leading-tight block">Get Reference ID</span>
          </div>
        </div>

        {/* Anonymity & Authority Assurance Footer Line */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold text-slate-800 pt-3.5 border-t-2 border-slate-200 w-full mt-4">
          <HeartHandshake className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>100% Anonymous & Confidential Reporting Guaranteed</span>
        </div>
      </div>
    </div>
  );
};
