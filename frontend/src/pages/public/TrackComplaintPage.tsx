import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  FolderTree,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Check,
} from 'lucide-react';
import { TrackComplaintResponse } from '../../types';
import { apiService } from '../../services/api';
import { STATUS_CONFIG } from '../../config/statusConfig';
import { formatDateTime } from '../../utils/dateFormatter';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { TicketStub } from '../../components/ui/TicketStub';
import { SectionEyebrow } from '../../components/ui/SectionEyebrow';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

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
      return 0; // Handled as special rejected state
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
  const [searched, setSearched] = useState<boolean>(false);

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
      {/* 1. Page Title Block */}
      <div className="text-center space-y-2.5 animate-fade-up">
        <SectionEyebrow rulePosition="both">PUBLIC COMPLAINT TRACKER</SectionEyebrow>
        <h1 className="text-2xl sm:text-4xl font-normal text-ink-navy tracking-tight font-serif">
          Track Your Complaint Status
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
          Enter your reference ID (e.g.{' '}
          <span className="font-mono font-semibold text-ink-navy">CQB-20260818-A7F2</span>) to view real-time proctor updates.
        </p>
      </div>

      {/* 2. Search Card */}
      <Card className="p-4 sm:p-5 shadow-sm">
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
            className="w-full sm:w-auto px-6 py-2.5"
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
        <div className="p-6 sm:p-8 rounded-xl bg-case-red/10 border border-case-red/20 text-center animate-fade-up max-w-xl mx-auto space-y-3">
          <div className="w-10 h-10 rounded-lg bg-case-red text-white flex items-center justify-center mx-auto">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-ink-navy">Complaint Record Not Found</h3>
            <p className="text-xs sm:text-sm text-case-red mt-1 leading-relaxed max-w-md mx-auto">{errorMessage}</p>
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

      {/* 5. Result State (TicketStub + Stepper + Details) */}
      {result && !isLoading && (
        <div className="space-y-6 animate-fade-up">
          <TicketStub
            eyebrow="OFFICIAL COMPLAINT TICKET"
            referenceId={result.complaint_id}
            status={result.status}
          >
            <div className="space-y-6">
              {/* Complaint Title & Current Phase Notice */}
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-ink-navy leading-snug">
                  {result.title}
                </h2>
                <div className="mt-2.5 p-3 rounded-lg bg-paper border border-hairline text-xs text-ink-muted flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-registrar-blue mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-ink-navy">Current Phase: </span>
                    <span>{STATUS_CONFIG[result.status]?.description || 'Complaint is actively being processed.'}</span>
                  </div>
                </div>
              </div>

              {/* Horizontal 4-Step Stepper */}
              {!isRejected ? (
                <div className="pt-2 pb-2">
                  <div className="flex items-center justify-between relative">
                    {LIFECYCLE_STEPS.map((stepItem, index) => {
                      const isCompleted = stepItem.step < activeStep;
                      const isCurrent = stepItem.step === activeStep;

                      return (
                        <React.Fragment key={stepItem.step}>
                          {/* Step Node */}
                          <div className="flex flex-col items-center text-center z-10">
                            <div
                              className={`w-7 h-7 rounded-full font-mono text-xs flex items-center justify-center transition-colors ${
                                isCompleted
                                  ? 'bg-ink-navy text-white font-semibold'
                                  : isCurrent
                                  ? 'bg-registrar-blue text-white font-semibold ring-4 ring-registrar-blue/15'
                                  : 'bg-paper border border-hairline text-ink-muted font-medium'
                              }`}
                            >
                              {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepItem.step}
                            </div>
                            <span
                              className={`text-[11px] sm:text-xs mt-1.5 font-medium ${
                                isCurrent
                                  ? 'text-registrar-blue font-semibold'
                                  : isCompleted
                                  ? 'text-ink-navy font-medium'
                                  : 'text-ink-muted'
                              }`}
                            >
                              {stepItem.label}
                            </span>
                            <span className="text-[10px] text-ink-muted hidden sm:block">
                              {stepItem.desc}
                            </span>
                          </div>

                          {/* Connecting Divider between steps */}
                          {index < LIFECYCLE_STEPS.length - 1 && (
                            <div
                              className={`flex-1 h-[2px] mx-2 -mt-5 sm:-mt-7 transition-colors ${
                                stepItem.step < activeStep ? 'bg-ink-navy' : 'bg-hairline'
                              }`}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-lg bg-case-red/10 border border-case-red/20 text-xs text-case-red flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    This ticket has been marked as <strong>Rejected</strong> by the Proctor Office and is not undergoing further action.
                  </span>
                </div>
              )}

              {/* Key Metadata Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-paper border border-hairline">
                  <FolderTree className="w-4 h-4 text-registrar-blue flex-shrink-0" />
                  <div>
                    <span className="text-ink-muted block text-[10px] uppercase font-mono tracking-wide">Category</span>
                    <span className="font-semibold text-ink-navy">{result.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-paper border border-hairline">
                  <MapPin className="w-4 h-4 text-registrar-blue flex-shrink-0" />
                  <div>
                    <span className="text-ink-muted block text-[10px] uppercase font-mono tracking-wide">Campus Location</span>
                    <span className="font-semibold text-ink-navy">{result.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-paper border border-hairline">
                  <Calendar className="w-4 h-4 text-ink-muted flex-shrink-0" />
                  <div>
                    <span className="text-ink-muted block text-[10px] uppercase font-mono tracking-wide">Submitted Date</span>
                    <span className="font-medium text-ink-navy">{formatDateTime(result.submitted_at)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-paper border border-hairline">
                  <Clock className="w-4 h-4 text-ink-muted flex-shrink-0" />
                  <div>
                    <span className="text-ink-muted block text-[10px] uppercase font-mono tracking-wide">Last Activity</span>
                    <span className="font-medium text-ink-navy">{formatDateTime(result.updated_at)}</span>
                  </div>
                </div>
              </div>

              {/* Issue Summary */}
              <div className="pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-ink-muted mb-1.5 font-medium">
                  Issue Summary
                </h4>
                <div className="text-xs sm:text-sm text-ink-navy leading-relaxed whitespace-pre-wrap bg-paper p-3.5 rounded-lg border border-hairline">
                  {result.description}
                </div>
              </div>

              {/* Public Resolution Card (If Available) */}
              {result.resolution ? (
                <div className="p-4 sm:p-5 rounded-xl bg-ledger-green/10 border border-ledger-green/20 shadow-sm space-y-2.5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-ledger-green text-white flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h3 className="font-semibold text-ink-navy text-xs sm:text-sm">
                          Official Resolution from Chief Proctor Office
                        </h3>
                        {result.resolved_at && (
                          <span className="text-[11px] text-ledger-green font-mono">
                            {formatDateTime(result.resolved_at)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-ink-navy mt-2 leading-relaxed whitespace-pre-wrap bg-paper-card p-3.5 rounded-lg border border-ledger-green/30">
                        {result.resolution}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-lg bg-paper border border-hairline text-xs text-ink-muted flex items-center gap-2">
                  <Clock className="w-4 h-4 text-ink-muted flex-shrink-0" />
                  <span>
                    Investigation or maintenance in progress. The official resolution note will appear here once finalized by the proctor team.
                  </span>
                </div>
              )}
            </div>
          </TicketStub>
        </div>
      )}

      {/* 6. Empty / Help State (shown before a search) */}
      {!searched && !result && !isLoading && !errorMessage && (
        <div className="p-8 rounded-xl bg-paper-card border border-hairline text-center text-ink-muted text-xs sm:text-sm shadow-sm space-y-2 max-w-xl mx-auto">
          <div className="w-10 h-10 rounded-lg bg-paper border border-hairline flex items-center justify-center mx-auto mb-2 text-ink-muted">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="font-medium text-ink-navy text-sm sm:text-base">
            Need to check a previous submission?
          </h3>
          <p className="text-ink-muted leading-relaxed max-w-md mx-auto">
            Paste the unique reference ID provided upon submission into the search bar above to inspect live action updates.
          </p>
        </div>
      )}
    </div>
  );
};
