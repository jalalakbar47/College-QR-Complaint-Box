import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Calendar,
  MapPin,
  FolderTree,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { TrackComplaintResponse } from '../../types';
import { apiService } from '../../services/api';
import { formatDateTime } from '../../utils/dateFormatter';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { TicketStub } from '../../components/ui/TicketStub';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { motion } from 'framer-motion';

const LIFECYCLE_STEPS = [
  { step: 1, label: 'Logged', desc: 'Received in portal' },
  { step: 2, label: 'Under Review', desc: 'Proctor evaluation' },
  { step: 3, label: 'In Progress', desc: 'Action underway' },
  { step: 4, label: 'Resolved', desc: 'Redressal recorded' },
];

function getActiveStepIndex(status: string): number {
  switch (status) {
    case 'New':
      return 1;
    case 'Under Review':
      return 2;
    case 'Assigned':
    case 'In Progress':
      return 3;
    case 'Resolved':
    case 'Closed':
      return 4;
    case 'Rejected':
      return 0;
    default:
      return 1;
  }
}

export const TrackComplaintPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [queryId, setQueryId] = useState<string>(initialId);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TrackComplaintResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, setSearched] = useState<boolean>(false);

  const handleSearch = async (targetId?: string) => {
    const idToSearch = (targetId || queryId).trim().toUpperCase();
    if (!idToSearch) return;

    setIsLoading(true);
    setErrorMessage(null);
    setResult(null);
    setSearched(true);

    try {
      const response = await apiService.trackComplaint(idToSearch);
      if (response.success && response.data) {
        setResult(response.data);
        setSearchParams({ id: idToSearch });
      } else {
        setErrorMessage(
          response.message || `No complaint record found matching ID "${idToSearch}". Please check the reference code and retry.`
        );
      }
    } catch {
      setErrorMessage('Unable to connect to the tracking service. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialId && initialId.trim() !== '') {
      handleSearch(initialId);
    }
  }, []);

  const activeStep = result ? getActiveStepIndex(result.status) : 1;
  const isRejected = result?.status === 'Rejected';

  return (
    <div className="min-h-full bg-paper py-10 sm:py-14 px-4 sm:px-6 lg:px-8 animate-fade-in" style={{ backgroundColor: '#EAEDF3' }}>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* 1. Page Header (Clean, Matching Home Page Paper Canvas) */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-paper-card border border-hairline text-ink-navy text-xs font-mono font-medium shadow-sm">
            <ShieldCheck className="w-4 h-4 text-seal-gold" />
            <span>PUBLIC COMPLAINT TRACKER</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-normal text-ink-navy tracking-tight font-serif">
            Track Your Complaint Status
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto leading-relaxed font-sans">
            Enter your reference ID (e.g.{' '}
            <span className="font-mono font-semibold text-ink-navy">CQB-20260818-A7F2</span>) to view real-time proctor updates.
          </p>
        </div>

        {/* 2. Search Card */}
        <Card className="p-4 sm:p-6 shadow-sm bg-paper-card border border-hairline rounded-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="flex-1 w-full">
              <Input
                placeholder="e.g. CQB-20260818-A7F2"
                value={queryId}
                onChange={(e) => setQueryId(e.target.value.toUpperCase())}
                leftIcon={<Search className="w-4 h-4 text-registrar-blue" />}
                className="font-mono font-semibold uppercase tracking-wider text-ink-navy"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full sm:w-auto px-6 py-2.5 shadow-sm whitespace-nowrap"
              isLoading={isLoading}
              disabled={isLoading || !queryId.trim()}
            >
              Track Status
            </Button>
          </form>
        </Card>

        {/* 3. Loading State */}
        {isLoading && (
          <div className="py-8">
            <LoadingSpinner size="lg" label="Querying complaint status from Proctor database..." />
          </div>
        )}

        {/* 4. Not Found / Error State */}
        {errorMessage && !isLoading && (
          <div className="p-6 sm:p-8 rounded-2xl bg-case-red/10 border border-case-red/20 text-center animate-fade-up max-w-xl mx-auto space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-case-red text-white flex items-center justify-center mx-auto shadow-xs">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-ink-navy">Complaint Record Not Found</h3>
              <p className="text-xs sm:text-sm text-case-red mt-1 leading-relaxed max-w-md mx-auto font-sans">{errorMessage}</p>
            </div>
            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setErrorMessage(null);
                  setSearched(false);
                }}
              >
                Try Another Reference ID
              </Button>
            </div>
          </div>
        )}

        {/* 5. Result Found: TicketStub Stepper & Details Card */}
        {result && !isLoading && (
          <div className="space-y-6 animate-fade-up">
            <TicketStub
              eyebrow="OFFICIAL GRIEVANCE RECORD"
              referenceId={result.complaint_id}
              statusPill={
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-registrar-blue/10 text-registrar-blue border border-registrar-blue/20">
                  {result.status}
                </span>
              }
            >
              <div className="space-y-6">
                {/* Complaint Title */}
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-ink-navy leading-snug">
                    {result.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-ink-muted mt-2 font-sans">
                    <span className="flex items-center gap-1 font-medium text-ink-navy">
                      <FolderTree className="w-3.5 h-3.5 text-registrar-blue" />
                      <span>{result.category}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-registrar-blue" />
                      <span>{result.location}</span>
                    </span>
                    {result.submitted_at && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDateTime(result.submitted_at)}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* 4-Step Lifecycle Stepper */}
                <div className="pt-2">
                  <span className="block text-xs font-mono font-semibold uppercase tracking-wider text-ink-muted mb-3">
                    Complaint Redressal Progress
                  </span>

                  {isRejected ? (
                    <div className="p-4 rounded-xl bg-case-red/10 border border-case-red/20 text-case-red text-xs sm:text-sm font-medium flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span>This complaint submission was reviewed and marked as Rejected / Ineligible.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                      {LIFECYCLE_STEPS.map((s) => {
                        const isDone = activeStep >= s.step;
                        const isCurrent = activeStep === s.step;

                        return (
                          <div
                            key={s.step}
                            className={`p-3 rounded-xl border relative overflow-hidden transition-colors ${
                              isCurrent
                                ? 'bg-seal-gold/10 border-seal-gold/40 text-ink-navy ring-1 ring-seal-gold/30'
                                : isDone
                                ? 'bg-ledger-green/10 border-ledger-green/30 text-ink-navy'
                                : 'bg-paper-recessed border-hairline text-ink-muted'
                            }`}
                          >
                            {isCurrent && (
                              <motion.div
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 0.4, ease: 'linear' }}
                                className="absolute bottom-0 left-0 h-0.5 bg-seal-gold"
                              />
                            )}
                            <div className="flex items-center gap-2 mb-1 relative z-10">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  isDone
                                    ? 'bg-ledger-green text-white'
                                    : isCurrent
                                    ? 'bg-seal-gold text-white'
                                    : 'bg-paper-card border border-hairline text-ink-muted'
                                }`}
                              >
                                {isDone ? <Check className="w-3 h-3" /> : s.step}
                              </div>
                              <span className="text-xs font-semibold truncate">{s.label}</span>
                            </div>
                            <span className="text-[10px] text-ink-muted block truncate font-sans relative z-10">{s.desc}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Official Resolution / Proctor Remarks Block */}
                {result.resolution && (
                  <div className="p-4 sm:p-5 rounded-xl bg-ledger-green/10 border border-ledger-green/30 space-y-2">
                    <div className="flex items-center gap-2 text-ledger-green font-semibold text-xs uppercase tracking-wider font-mono">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Official Proctor Redressal Note</span>
                    </div>
                    <p className="text-xs sm:text-sm text-ink-navy leading-relaxed font-sans font-medium">
                      "{result.resolution}"
                    </p>
                  </div>
                )}
              </div>
            </TicketStub>
          </div>
        )}

        {/* 6. Empty State Help Card when no search performed */}
        {!result && !isLoading && !errorMessage && (
          <Card className="p-6 sm:p-8 bg-paper-card border border-hairline rounded-2xl shadow-sm text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-paper-recessed border border-hairline flex items-center justify-center mx-auto text-ink-muted shadow-2xs">
              <HelpCircle className="w-5 h-5 text-registrar-blue" />
            </div>
            <h3 className="font-serif text-base sm:text-lg font-normal text-ink-navy">
              Where can I find my Reference ID?
            </h3>
            <p className="text-xs text-ink-muted max-w-md mx-auto leading-relaxed font-sans">
              Your Reference ID is a unique tracking code (e.g. <span className="font-mono font-semibold text-ink-navy">CQB-20260818-A7F2</span>) shown on screen and printed on your submission ticket when filing a complaint.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
