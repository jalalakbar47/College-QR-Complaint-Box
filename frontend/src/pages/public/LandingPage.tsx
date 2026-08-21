import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  PlusCircle,
  Search,
  Lock,
  HeartHandshake,
  QrCode,
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
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { QRDisplay } from '../../components/qr/QRDisplay';
import { ENV } from '../../config/env';

const CATEGORY_SHOWCASE = [
  { name: 'Academic & Lectures', icon: BookOpen, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { name: 'Examination & Grades', icon: GraduationCap, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { name: 'Harassment & Safety', icon: ShieldAlert, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { name: 'Anti-Bullying & Ragging', icon: UserX, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { name: 'Infrastructure & Labs', icon: Building, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
  { name: 'Electricity & Backup', icon: Zap, color: 'text-amber-500 bg-amber-50 border-amber-200' },
  { name: 'Cleanliness & Hygiene', icon: Sparkles, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { name: 'Drinking Water & Restrooms', icon: Droplets, color: 'text-sky-600 bg-sky-50 border-sky-200' },
  { name: 'Campus Wi-Fi & IT Labs', icon: Wifi, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { name: 'College Transport Buses', icon: Bus, color: 'text-orange-600 bg-orange-50 border-orange-200' },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [quickTrackId, setQuickTrackId] = useState('');

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

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-hidden">
      {/* 1. Hero Section with Gradient Mesh & Glow */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-brand-950 text-white pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-grid-white opacity-40 pointer-events-none" />

        {/* Ambient radial blur orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute top-3/4 left-1/4 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-7 z-10">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-brand-500/30 text-brand-300 text-xs font-bold tracking-wide shadow-lg backdrop-blur-md animate-fade-in">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            <span>{ENV.COLLEGE_NAME}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] font-display">
            Fast, Confidential & Accountable <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-sky-200 to-indigo-300">
              Campus Issue Reporting
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Empowering students with a direct, friction-free channel to the <strong className="text-white font-semibold">Chief Proctor Office</strong>. Submit academic, infrastructure, or safety grievances with guaranteed confidentiality and real-time resolution tracking.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            <Link to="/complaint" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-600 shadow-glow text-white text-sm sm:text-base font-bold py-4 px-8 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                leftIcon={<PlusCircle className="w-5 h-5" />}
              >
                Submit a Complaint
              </Button>
            </Link>

            <Link to="/track" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-white border-slate-700 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-600 text-sm sm:text-base py-4 px-8 rounded-2xl backdrop-blur-xs transition-all duration-200"
                leftIcon={<Search className="w-5 h-5 text-slate-300" />}
              >
                Track Existing Complaint
              </Button>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-left max-w-4xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">100% Anonymous</span>
                <span className="text-[11px] text-slate-400">Zero identity logs</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Chief Proctor</span>
                <span className="text-[11px] text-slate-400">Direct supervision</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 flex-shrink-0">
                <FileCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Unique CQB ID</span>
                <span className="text-[11px] text-slate-400">Instant tracking code</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Swift Redressal</span>
                <span className="text-[11px] text-slate-400">Fast action cycle</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Track Interactive Bar */}
      <section className="-mt-10 sm:-mt-14 max-w-4xl mx-auto px-4 sm:px-6 relative z-20">
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-elevated">
          <form onSubmit={handleQuickTrack} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider pl-2 flex-shrink-0">
              <Search className="w-4 h-4 text-brand-600" />
              <span>Quick Track:</span>
            </div>

            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Enter Ticket ID (e.g. CQB-20260818-A7F2)..."
                value={quickTrackId}
                onChange={(e) => setQuickTrackId(e.target.value)}
                className="w-full text-xs sm:text-sm font-mono font-bold px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 uppercase tracking-wider"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 flex-shrink-0 shadow-sm"
            >
              <span>Track Ticket</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* 3. Main Workflow & Interactive QR Placard Studio */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left 7 Columns: Step by step journey */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-extrabold border border-brand-200/80 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>Transparent Process</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
                How the QR Complaint Box Works
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Designed to make student complaint filing frictionless, safe, and quickly actionable by campus administration.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Step 1 */}
              <div className="group flex items-start gap-4 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-subtle hover:shadow-card hover:border-brand-300 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white font-extrabold text-lg flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                  1
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Scan Campus QR Code</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Look for official QR code placards installed across lecture halls, labs, hostels, cafeteria, and college entrance gates.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group flex items-start gap-4 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-subtle hover:shadow-card hover:border-brand-300 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white font-extrabold text-lg flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  2
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Select Category & Describe Issue</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Choose the issue type (academic, infrastructure, hygiene, ragging, harassment, electricity, etc.) and describe what happened clearly.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group flex items-start gap-4 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-subtle hover:shadow-card hover:border-brand-300 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white font-extrabold text-lg flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                  3
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Submit Anonymously or with Info</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Choose whether you wish to submit your student ID or submit 100% anonymously. Receive a unique Reference ID instantly.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="group flex items-start gap-4 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-subtle hover:shadow-card hover:border-brand-300 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-emerald-700 text-white font-extrabold text-lg flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  4
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Track Status & Proctor Resolution</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Use your Reference ID to check live updates as the Proctor reviews, assigns, and resolves your complaint.
                  </p>
                </div>
              </div>
            </div>

            {/* Proctor Privacy Guarantee Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 shadow-subtle flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-600/20">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-emerald-950 text-base">Proctor Privacy Guarantee</h4>
                <p className="text-xs sm:text-sm text-emerald-800 mt-1 leading-relaxed">
                  Your safety and academic freedom are our highest priority. When "Anonymous" is selected, zero student identifiers are recorded in Google Sheets or backend logs.
                </p>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: QR Code Station Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-card">
                <div className="text-center mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-extrabold border border-brand-200/80 mb-2">
                    <QrCode className="w-3.5 h-3.5 text-brand-600" />
                    <span>Campus QR Placard</span>
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">
                    Direct Mobile Submission
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Scan or share this code with students across campus
                  </p>
                </div>

                <QRDisplay url={portalComplaintUrl} size={190} showActions={true} />

                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col gap-2.5">
                  <Link
                    to="/admin/login"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-bold transition-colors border border-slate-200/60"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Chief Proctor / Admin Portal Access</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Supported Campus Issue Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold border border-indigo-200/80 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Comprehensive Redressal</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Supported Complaint Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            The Chief Proctor Office handles all campus concerns with dedicated department liaisons.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {CATEGORY_SHOWCASE.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="group p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-card hover:border-brand-300 transition-all duration-200 flex flex-col items-center text-center gap-2.5"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${cat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Direct Action Callout Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white p-8 sm:p-12 shadow-elevated border border-slate-800">
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-xl sm:text-3xl font-extrabold text-white font-display">
                Have an Issue on Campus Today?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Don't hesitate. Your feedback drives positive campus change. Report directly to the Chief Proctor in less than 60 seconds.
              </p>
            </div>

            <Link to="/complaint" className="flex-shrink-0">
              <Button
                variant="primary"
                size="lg"
                className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 px-8 rounded-2xl shadow-glow transition-all"
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
