import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, HeartHandshake } from 'lucide-react';
import { ENV } from '../../config/env';

export interface PrintableQRCardProps {
  locationName?: string;
  complaintUrl?: string;
  paperSize?: 'A4' | 'A5' | 'Letter';
}

export const PrintableQRCard: React.FC<PrintableQRCardProps> = ({
  locationName = 'General Campus',
  complaintUrl = typeof window !== 'undefined' ? `${window.location.origin}/complaint` : 'http://localhost:3000/complaint',
}) => {
  return (
    <div
      id="printable-poster"
      className="bg-white border-4 border-ink-navy rounded-3xl text-center w-full text-ink-navy flex flex-col items-center justify-between"
    >
      {/* 1. Header Emblem & Institution Info */}
      <div className="flex flex-col items-center w-full">
        <div className="poster-emblem w-16 h-16 rounded-2xl bg-registrar-blue text-white flex items-center justify-center mb-3 shadow-xs">
          <ShieldCheck className="w-10 h-10 text-seal-gold" />
        </div>
        <h2 className="poster-title font-serif text-2xl sm:text-3xl font-bold text-ink-navy leading-tight text-center tracking-tight max-w-xl">
          {ENV.COLLEGE_NAME || 'Government Post Graduate College Khar District Bajaur'}
        </h2>
        <p className="poster-subtitle font-mono text-xs uppercase tracking-widest text-registrar-blue font-bold mt-1.5">
          Office of the Chief Proctor • Student Grievance Cell
        </p>

        {/* Location Badge */}
        <div className="poster-location inline-block bg-ink-navy text-white text-xs font-mono font-bold uppercase tracking-wider px-5 py-1.5 rounded-full mt-3">
          Location: {locationName}
        </div>
      </div>

      {/* 2. High-DPI Vector QR Code */}
      <div className="flex flex-col items-center my-3 w-full">
        <div className="poster-qr-box p-4 bg-white rounded-3xl border-4 border-ink-navy inline-block">
          <QRCodeSVG
            value={complaintUrl}
            size={240}
            level="H"
            includeMargin={false}
          />
        </div>

        <h3 className="poster-cta font-serif text-2xl font-bold text-ink-navy tracking-tight mt-4 mb-1">
          Scan to Report a Campus Issue
        </h3>
        <p className="poster-desc text-xs font-medium text-ink-muted max-w-md mx-auto text-center font-sans">
          Point your smartphone camera to file a confidential report directly to the Chief Proctor.
        </p>
      </div>

      {/* 3. 3-Step Guide */}
      <div className="poster-steps grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-paper-recessed border-2 border-hairline text-left w-full max-w-lg">
        <div className="border-r border-hairline pr-2">
          <span className="poster-steps-num font-mono font-bold text-registrar-blue text-xs block leading-none mb-0.5">
            1. SCAN
          </span>
          <span className="poster-steps-title text-xs font-bold text-ink-navy block">Open Camera</span>
          <span className="poster-steps-desc text-[10px] text-ink-muted leading-tight block font-sans">Point at placard</span>
        </div>
        <div className="border-r border-hairline pr-2">
          <span className="poster-steps-num font-mono font-bold text-registrar-blue text-xs block leading-none mb-0.5">
            2. REPORT
          </span>
          <span className="poster-steps-title text-xs font-bold text-ink-navy block">Describe Issue</span>
          <span className="poster-steps-desc text-[10px] text-ink-muted leading-tight block font-sans">Anonymous or named</span>
        </div>
        <div>
          <span className="poster-steps-num font-mono font-bold text-registrar-blue text-xs block leading-none mb-0.5">
            3. TRACK
          </span>
          <span className="poster-steps-title text-xs font-bold text-ink-navy block">Live Progress</span>
          <span className="poster-steps-desc text-[10px] text-ink-muted leading-tight block font-sans">Get Reference ID</span>
        </div>
      </div>

      {/* 4. Anonymity & Authority Guarantee */}
      <div className="poster-footer flex items-center justify-center gap-2 text-xs font-bold text-ink-navy pt-3 border-t-2 border-hairline w-full">
        <HeartHandshake className="w-4 h-4 text-ledger-green flex-shrink-0" />
        <span>100% Anonymous &amp; Confidential Reporting Guaranteed</span>
      </div>
    </div>
  );
};
