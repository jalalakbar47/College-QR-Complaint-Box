import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  PlusCircle,
  Search,
  Lock,
  HeartHandshake,
  QrCode,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { QRDisplay } from '../../components/qr/QRDisplay';

export const LandingPage: React.FC = () => {
  const portalComplaintUrl = typeof window !== 'undefined' ? `${window.location.origin}/complaint` : 'http://localhost:3000/complaint';

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-900 via-navy-900 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 shadow-xl">
        {/* Background glow circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-800/80 border border-brand-700/60 text-brand-200 text-xs font-semibold tracking-wide shadow-sm backdrop-blur-xs animate-fade-in">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            <span>Official Student Grievance & Redressal Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Campus QR Complaint Box
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Fast, confidential, and accountable campus issue reporting. Submit academic, infrastructure, or safety grievances directly to the Chief Proctor.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link to="/complaint" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 shadow-elevated text-white text-base font-bold py-4 px-8"
                leftIcon={<PlusCircle className="w-5 h-5" />}
              >
                Submit a Grievance
              </Button>
            </Link>

            <Link to="/track" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-white border-slate-600 hover:bg-slate-800/60 text-base py-4 px-8"
                leftIcon={<Search className="w-5 h-5" />}
              >
                Track Existing Complaint
              </Button>
            </Link>
          </div>

          {/* Feature Micro-Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Anonymous Option</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Proctor Review</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Unique Reference ID Tracking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid: How It Works & QR Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: Step by step flow */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
                Transparent Workflow
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                How the QR Complaint Box Works
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Designed to make student grievance filing frictionless, safe, and quickly actionable by campus administration.
              </p>
            </div>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle hover:border-brand-200 transition-all">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-extrabold text-base flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Scan Campus QR Code</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                    Look for official QR code placards installed across lecture halls, labs, hostels, cafeteria, and college entrance gates.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle hover:border-brand-200 transition-all">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-extrabold text-base flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Select Category & Describe Issue</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                    Choose the issue type (academic, infrastructure, hygiene, ragging, harassment, electricity, etc.) and describe what happened.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle hover:border-brand-200 transition-all">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-extrabold text-base flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Submit Anonymously or with Info</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                    Choose whether you wish to submit your student ID or submit 100% anonymously. Receive a unique Reference ID instantly.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-subtle hover:border-brand-200 transition-all">
                <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-extrabold text-base flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Track Status & Proctor Resolution</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                    Use your Reference ID to check live updates as the Proctor reviews, assigns, and resolves your complaint.
                  </p>
                </div>
              </div>
            </div>

            {/* Anonymous Guarantee Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-950 text-sm">Proctor Privacy Guarantee</h4>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                  Your safety and academic freedom are our highest priority. When "Anonymous" is selected, zero student identifiers are recorded in Google Sheets or backend logs.
                </p>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: QR Code Card & Quick Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-card">
              <div className="text-center mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200/80 mb-2">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Campus QR Preview</span>
                </span>
                <h3 className="text-lg font-bold text-slate-900">Direct Mobile Submission</h3>
                <p className="text-xs text-slate-500">Scan or share this code with students across campus</p>
              </div>

              <QRDisplay url={portalComplaintUrl} size={180} showActions={true} />

              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Chief Proctor / Admin Portal Access</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
