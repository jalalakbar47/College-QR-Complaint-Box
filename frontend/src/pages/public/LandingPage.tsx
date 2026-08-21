import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  PlusCircle,
  Search,
  Lock,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Sparkles,
  Zap,
  Building,
  Wifi,
  Bus,
  Droplets,
  ShieldAlert,
  UserX,
  FileCheck,
  ChevronRight,
  Copy,
  Download,
  Check,
  ExternalLink,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../../components/ui/Button';
import { Pill } from '../../components/ui/Pill';
import { TicketStub } from '../../components/ui/TicketStub';
import { SectionEyebrow } from '../../components/ui/SectionEyebrow';
import { useToast } from '../../contexts/ToastContext';
import { ENV } from '../../config/env';

const CATEGORY_SHOWCASE = [
  { name: 'Academic & Lectures', icon: BookOpen },
  { name: 'Examination & Grades', icon: GraduationCap },
  { name: 'Harassment & Safety', icon: ShieldAlert },
  { name: 'Anti-Bullying & Ragging', icon: UserX },
  { name: 'Infrastructure & Labs', icon: Building },
  { name: 'Electricity & Backup', icon: Zap },
  { name: 'Cleanliness & Hygiene', icon: Sparkles },
  { name: 'Drinking Water & Restrooms', icon: Droplets },
  { name: 'Campus Wi-Fi & IT Labs', icon: Wifi },
  { name: 'College Transport Buses', icon: Bus },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { success } = useToast();
  const [quickTrackId, setQuickTrackId] = useState('');
  const [copied, setCopied] = useState(false);
  const qrRef = React.useRef<HTMLDivElement>(null);

  const portalComplaintUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/complaint`
      : 'http://localhost:3000/complaint';

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackId.trim()) {
      navigate(`/track?id=${encodeURIComponent(quickTrackId.trim().toUpperCase())}`);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(portalComplaintUrl);
    setCopied(true);
    success('Complaint portal link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 600;
      canvas.height = 600;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `gpgc-khar-complaint-qr-${Date.now()}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 overflow-hidden bg-paper">
      {/* 1. Hero Section (ink-navy background with campus photo, full-bleed, restrained dot grid) */}
      <section
        className="relative overflow-hidden bg-ink-navy text-white pt-14 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-ink-navy"
        style={{ backgroundColor: '#101B36' }}
      >
        {/* Campus Background Image with Increased Opacity & Balanced ink-navy Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/background.jpeg"
            alt="GPGC Khar District Bajaur Campus Background"
            className="w-full h-full object-cover object-center opacity-55 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-navy/75 via-ink-navy/65 to-ink-navy/95" />
          <div className="absolute inset-0 bg-dots-pattern opacity-5" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6 z-10">
          {/* Institution Eyebrow Pill on Dark Background */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-mono tracking-wide backdrop-blur-xs animate-fade-in">
            <ShieldCheck className="w-3.5 h-3.5 text-seal-gold flex-shrink-0" />
            <span className="truncate">{ENV.COLLEGE_NAME || 'Government Post Graduate College Khar District Bajaur'}</span>
          </div>

          {/* H1 in Fraunces */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.14] font-serif max-w-4xl mx-auto">
            Fast, Confidential &amp; Accountable <br className="hidden sm:inline" />
            <span className="text-seal-gold font-medium">Campus Issue Reporting</span>
          </h1>

          {/* Supporting Paragraph */}
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Empowering students with a direct, confidential channel to the <strong className="text-white font-medium">Chief Proctor Office</strong>. Submit academic, infrastructure, or safety concerns with guaranteed privacy and live resolution tracking.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/complaint" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto font-medium py-3.5 px-6 shadow-sm"
                leftIcon={<PlusCircle className="w-5 h-5" />}
              >
                Submit a Complaint
              </Button>
            </Link>

            <Link to="/track" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 active:bg-white/25 text-white border-white/30 backdrop-blur-xs font-medium py-3.5 px-6"
                leftIcon={<Search className="w-5 h-5 text-slate-300" />}
              >
                Track Existing Complaint
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Trust Strip (4 items, floating card row overlapping hero) */}
      <section className="-mt-10 sm:-mt-14 max-w-6xl mx-auto px-4 sm:px-6 relative z-20">
        <div className="bg-paper-card rounded-xl border border-hairline shadow-sm p-4 sm:p-5 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-paper-recessed border border-hairline">
            <div className="w-8 h-8 rounded-lg bg-ink-navy text-white flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 text-ledger-green" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-ink-navy text-xs sm:text-sm block truncate">100% Anonymous</span>
              <span className="text-[11px] text-ink-muted block truncate">Zero identity logs</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-paper-recessed border border-hairline">
            <div className="w-8 h-8 rounded-lg bg-ink-navy text-white flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4 text-seal-gold" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-ink-navy text-xs sm:text-sm block truncate">Chief Proctor</span>
              <span className="text-[11px] text-ink-muted block truncate">Direct supervision</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-paper-recessed border border-hairline">
            <div className="w-8 h-8 rounded-lg bg-ink-navy text-white flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-4 h-4 text-registrar-blue" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-ink-navy text-xs sm:text-sm block truncate">Unique CQB ID</span>
              <span className="text-[11px] text-ink-muted block truncate">Instant tracking code</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-paper-recessed border border-hairline">
            <div className="w-8 h-8 rounded-lg bg-ink-navy text-white flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-seal-gold" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-ink-navy text-xs sm:text-sm block truncate">Swift Redressal</span>
              <span className="text-[11px] text-ink-muted block truncate">Fast action cycle</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quick Track Bar */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="p-4 sm:p-5 rounded-xl bg-paper-card border border-hairline shadow-sm">
          <form onSubmit={handleQuickTrack} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-1.5 text-ink-navy font-mono text-xs font-semibold uppercase tracking-wider pl-1 flex-shrink-0">
              <Search className="w-4 h-4 text-registrar-blue" />
              <span>Quick Track:</span>
            </div>

            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="e.g. CQB-20260818-A7F2"
                value={quickTrackId}
                onChange={(e) => setQuickTrackId(e.target.value)}
                className="w-full text-xs sm:text-sm font-mono font-medium px-3.5 py-2.5 rounded-lg border border-hairline bg-paper-recessed text-ink-navy placeholder:text-ink-muted placeholder:font-mono focus:outline-none focus:ring-2 focus:ring-registrar-blue focus:bg-paper-card uppercase tracking-wide min-h-[44px] transition-colors"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full sm:w-auto px-5 shadow-sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Track Ticket
            </Button>
          </form>
        </div>
      </section>

      {/* 4. Main Workflow & TicketStub QR Placard Studio */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (7 cols): Step by Step Journey */}
          <div className="lg:col-span-7 space-y-6">
            <div className="animate-fade-up space-y-2">
              <SectionEyebrow rulePosition="left">TRANSPARENT PROCESS</SectionEyebrow>
              <h2 className="text-2xl sm:text-4xl font-normal text-ink-navy tracking-tight font-serif">
                How the QR Complaint Box Works
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                Designed to make student complaint filing frictionless, safe, and quickly actionable by campus administration.
              </p>
            </div>

            {/* Stepper Cards */}
            <div className="relative space-y-4 pt-1">
              {/* Step 1 */}
              <div className="flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-paper-card border border-hairline shadow-sm">
                <div className="w-8 h-8 rounded-full bg-ink-navy text-white font-mono text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-ink-navy text-sm sm:text-base">Scan Campus QR Code</h3>
                  <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
                    Look for official QR code placards installed across lecture halls, labs, hostels, cafeteria, and college entrance gates.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-paper-card border border-hairline shadow-sm">
                <div className="w-8 h-8 rounded-full bg-ink-navy text-white font-mono text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-ink-navy text-sm sm:text-base">Select Category &amp; Describe Issue</h3>
                  <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
                    Choose the issue type (academic, infrastructure, hygiene, ragging, harassment, electricity, etc.) and describe what happened clearly.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-paper-card border border-hairline shadow-sm">
                <div className="w-8 h-8 rounded-full bg-ink-navy text-white font-mono text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-ink-navy text-sm sm:text-base">Submit Anonymously or with Info</h3>
                  <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
                    Choose whether you wish to submit your student ID or submit 100% anonymously. Receive a unique Reference ID instantly.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-paper-card border border-hairline shadow-sm">
                <div className="w-8 h-8 rounded-full bg-ink-navy text-white font-mono text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-ink-navy text-sm sm:text-base">Track Status &amp; Proctor Resolution</h3>
                  <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
                    Use your Reference ID to check live updates as the Proctor reviews, assigns, and resolves your complaint.
                  </p>
                </div>
              </div>
            </div>

            {/* Proctor Privacy Guarantee Callout Box */}
            <div className="p-5 sm:p-6 rounded-xl bg-ledger-green/10 border border-ledger-green/20 shadow-sm flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-ledger-green text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-ink-navy text-sm sm:text-base">Proctor Privacy Guarantee</h4>
                <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed font-sans">
                  Your safety and academic freedom are our highest priority. When "Anonymous" is selected, zero student identifiers are recorded in Google Sheets or backend logs.
                </p>
              </div>
            </div>

            {/* Admin Portal Access Link Row */}
            <Link
              to="/admin/login"
              className="flex items-center justify-between p-4 rounded-xl bg-paper-card border border-hairline hover:border-registrar-blue hover:shadow-md text-ink-navy text-xs sm:text-sm font-medium transition-all shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-paper-recessed border border-hairline flex items-center justify-center text-ink-navy">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <span>Chief Proctor / Admin Portal Access</span>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-muted" />
            </Link>
          </div>

          {/* Right Column (5 cols): Sticky TicketStub QR Placard */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <TicketStub
                eyebrow="CAMPUS QR PLACARD"
                referenceId="Direct Mobile Submission"
                statusPill={<Pill variant="new" size="sm" label="Scan to Submit" />}
              >
                <div className="flex flex-col items-center text-center">
                  {/* QR Code Container */}
                  <div
                    ref={qrRef}
                    className="p-3 bg-white rounded-lg border border-hairline shadow-sm mb-3 flex items-center justify-center"
                  >
                    <QRCodeSVG
                      value={portalComplaintUrl}
                      size={180}
                      level="H"
                      includeMargin={false}
                    />
                  </div>

                  <h4 className="font-semibold text-ink-navy text-sm sm:text-base">
                    Scan to Submit Complaint
                  </h4>
                  <p className="text-xs text-ink-muted max-w-xs mt-0.5 leading-relaxed font-sans">
                    Point your smartphone camera to instantly open the confidential form
                  </p>

                  {/* Target URL Chip */}
                  <div className="w-full flex items-center justify-between p-2.5 rounded-lg bg-paper-recessed border border-hairline text-xs text-ink-muted font-mono my-3.5">
                    <span className="truncate pr-2">{portalComplaintUrl}</span>
                    <a
                      href={portalComplaintUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-registrar-blue hover:text-registrar-blue/80 p-1 flex-shrink-0"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 w-full">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={handleCopyUrl}
                      leftIcon={
                        copied ? (
                          <Check className="w-3.5 h-3.5 text-ledger-green" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )
                      }
                    >
                      {copied ? 'Copied' : 'Copy URL'}
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1 text-xs shadow-sm"
                      onClick={handleDownloadQr}
                      leftIcon={<Download className="w-3.5 h-3.5" />}
                    >
                      Download PNG
                    </Button>
                  </div>
                </div>
              </TicketStub>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Supported Complaint Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2 animate-fade-up">
          <SectionEyebrow rulePosition="both">COMPREHENSIVE REDRESSAL</SectionEyebrow>
          <h2 className="text-2xl sm:text-4xl font-normal text-ink-navy tracking-tight font-serif">
            Supported Complaint Categories
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted font-sans">
            The Chief Proctor Office handles all campus concerns with dedicated department liaisons.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {CATEGORY_SHOWCASE.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="group p-4 rounded-xl bg-paper-card border border-hairline shadow-sm hover:shadow-md hover:border-registrar-blue transition-all duration-150 flex flex-col items-center text-center gap-3 cursor-default"
              >
                <div className="w-10 h-10 rounded-lg bg-paper-recessed border border-hairline text-registrar-blue flex items-center justify-center group-hover:bg-registrar-blue/10 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-ink-navy group-hover:text-registrar-blue transition-colors leading-tight">
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. CTA Banner (ink-navy-card, rounded-2xl, contained) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div
          className="rounded-2xl bg-ink-navy-card text-white p-6 sm:p-10 border border-white/10 shadow-md relative overflow-hidden"
          style={{ backgroundColor: '#16234A' }}
        >
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-xl sm:text-3xl font-normal text-white font-serif">
                Have an Issue on Campus Today?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Don't hesitate. Your feedback drives positive campus change. Report directly to the Chief Proctor in less than 60 seconds.
              </p>
            </div>

            <Link to="/complaint" className="flex-shrink-0 w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto font-medium py-3 px-6 shadow-sm"
                leftIcon={<PlusCircle className="w-5 h-5" />}
              >
                Submit Complaint Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
