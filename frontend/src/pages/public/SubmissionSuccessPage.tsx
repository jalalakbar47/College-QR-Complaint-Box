import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Copy,
  Check,
  Search,
  PlusCircle,
  Home,
  Info,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useToast } from '../../contexts/ToastContext';

export const SubmissionSuccessPage: React.FC = () => {
  const location = useLocation();
  const { success } = useToast();
  const [copied, setCopied] = useState(false);

  const stateData = location.state as { complaintId?: string; complaint?: any } | null;
  const complaintId = stateData?.complaintId || 'CQB-SAMPLE-ID';

  useEffect(() => {
    // Fire confetti celebration on successful submission
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0270c7', '#0c8fe9', '#10b981', '#3b82f6'],
      });
    } catch {
      // ignore
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(complaintId);
    setCopied(true);
    success('Complaint Reference ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center space-y-6">
        {/* Success Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto shadow-sm border border-emerald-200">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Complaint Submitted Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            Your complaint has been securely logged and forwarded to the Chief Proctor Office for evaluation.
          </p>
        </div>

        {/* Reference ID Card */}
        <Card className="bg-slate-50/80 border-2 border-brand-200/80 p-6 sm:p-8">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">
            Your Unique Reference ID
          </span>

          <div className="flex items-center justify-center gap-3 my-3">
            <span className="font-mono text-xl sm:text-2xl font-black text-brand-800 bg-white px-4 py-2 rounded-xl border border-brand-300 shadow-sm tracking-wider">
              {complaintId}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="mt-2 text-xs font-semibold"
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          >
            {copied ? 'Copied to Clipboard!' : 'Copy Reference ID'}
          </Button>

          <div className="mt-5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-800 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Important:</strong> Please save this reference ID. You will need it to track investigation status and read resolution notes.
            </span>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Link to={`/track?id=${complaintId}`} className="block">
            <Button
              variant="primary"
              size="lg"
              className="w-full text-sm font-bold py-3.5"
              leftIcon={<Search className="w-4 h-4" />}
            >
              Track This Complaint
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/complaint" className="flex-1">
              <Button
                variant="secondary"
                size="md"
                className="w-full text-xs sm:text-sm"
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Submit Another
              </Button>
            </Link>

            <Link to="/" className="flex-1">
              <Button
                variant="outline"
                size="md"
                className="w-full text-xs sm:text-sm"
                leftIcon={<Home className="w-4 h-4" />}
              >
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
