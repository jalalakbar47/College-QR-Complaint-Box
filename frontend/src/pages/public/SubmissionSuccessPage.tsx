import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import {
  ticketStubEntranceVariants,
  usePrefersReducedMotion,
  getMotionVariant,
  MOTION_EASINGS,
} from '../../lib/motion';

export const SubmissionSuccessPage: React.FC = () => {
  const location = useLocation();
  const { success } = useToast();
  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const stateData = location.state as { complaintId?: string; complaint?: any } | null;
  const complaintId = stateData?.complaintId || 'CQB-SAMPLE-ID';

  const cardVariants = getMotionVariant(ticketStubEntranceVariants, prefersReducedMotion);

  const handleCopy = () => {
    navigator.clipboard.writeText(complaintId);
    setCopied(true);
    success('Complaint Reference ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <motion.div
        initial="initial"
        animate="animate"
        variants={cardVariants}
        className="text-center space-y-6"
      >
        {/* Success Icon with subtle scale appearance */}
        <motion.div
          initial={{ scale: prefersReducedMotion ? 1 : 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: MOTION_EASINGS.easeOutQuart }}
          className="w-16 h-16 sm:w-20 sm:h-20 bg-ledger-green/10 rounded-3xl flex items-center justify-center text-ledger-green mx-auto shadow-sm border border-ledger-green/20"
        >
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </motion.div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-ink-navy tracking-tight">
            Complaint Submitted Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-2 max-w-sm mx-auto font-sans">
            Your complaint has been securely logged and forwarded to the Chief Proctor Office for evaluation.
          </p>
        </div>

        {/* Reference ID Card with single brief pulse on the reference pill */}
        <Card className="bg-paper-card border border-hairline shadow-md p-6 sm:p-8 rounded-2xl">
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-ink-muted block mb-2">
            Your Unique Reference ID
          </span>

          <div className="flex items-center justify-center gap-3 my-3">
            <motion.span
              initial={{ scale: 1, opacity: 0.9 }}
              animate={
                prefersReducedMotion
                  ? { scale: 1, opacity: 1 }
                  : { scale: [1, 1.04, 1], opacity: [0.9, 1, 1] }
              }
              transition={{ delay: 0.4, duration: 0.35, ease: MOTION_EASINGS.standardEase }}
              className="font-mono text-xl sm:text-2xl font-bold text-registrar-blue bg-paper-recessed px-4 py-2.5 rounded-xl border border-hairline shadow-sm tracking-wider"
            >
              {complaintId}
            </motion.span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            className="mt-2 text-xs font-medium"
            leftIcon={copied ? <Check className="w-4 h-4 text-ledger-green" /> : <Copy className="w-4 h-4" />}
          >
            {copied ? 'Copied to Clipboard!' : 'Copy Reference ID'}
          </Button>

          <div className="mt-5 p-3.5 rounded-xl bg-seal-gold/10 border border-seal-gold/25 text-left text-xs text-ink-navy flex items-start gap-2.5">
            <Info className="w-4 h-4 text-seal-gold flex-shrink-0 mt-0.5" />
            <span>
              <strong>Important:</strong> Please save this reference ID. You will need it to track investigation status and read official resolution notes.
            </span>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Link to={`/track?id=${complaintId}`} className="block">
            <Button
              variant="primary"
              size="lg"
              className="w-full text-sm font-medium py-3.5 shadow-sm"
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
      </motion.div>
    </div>
  );
};
