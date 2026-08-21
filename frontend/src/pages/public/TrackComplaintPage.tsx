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
} from 'lucide-react';
import { TrackComplaintResponse } from '../../types';
import { apiService } from '../../services/api';
import { ComplaintStatusBadge } from '../../components/complaints/ComplaintStatusBadge';
import { STATUS_CONFIG } from '../../config/statusConfig';
import { formatDateTime } from '../../utils/dateFormatter';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const TrackComplaintPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [queryId, setQueryId] = useState<string>(initialId);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TrackComplaintResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searched, setSearched] = useState<boolean>(false);

  const handleSearch = async (targetId?: string) => {
    const idToSearch = (targetId || queryId).trim();
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
          response.message || `No complaint record found with ID "${idToSearch}". Please check and try again.`
        );
      }
    } catch {
      setErrorMessage('Unable to connect to the tracking server. Please check your network.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialId && initialId.trim() !== '') {
      handleSearch(initialId);
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-3">
          <Search className="w-4 h-4 text-brand-600" />
          <span>Public Complaint Tracker</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Track Your Complaint Status
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Enter your Reference ID (e.g. <span className="font-mono font-bold text-slate-700">CQB-20260818-A7F2</span>) to view real-time proctor updates.
        </p>
      </div>

      {/* Search Bar Card */}
      <Card className="p-4 sm:p-5 shadow-card mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="flex-1 w-full">
            <Input
              placeholder="Enter Complaint ID (e.g. CQB-20260818-A7F2)"
              value={queryId}
              onChange={(e) => setQueryId(e.target.value.toUpperCase())}
              leftIcon={<Search className="w-4 h-4" />}
              className="font-mono font-medium uppercase"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-auto px-6 py-2.5"
            isLoading={isLoading}
            disabled={isLoading || !queryId.trim()}
          >
            Track Status
          </Button>
        </form>
      </Card>

      {/* Loading state */}
      {isLoading && (
        <LoadingSpinner size="lg" label="Querying complaint status from Proctor database..." />
      )}

      {/* Error state */}
      {errorMessage && !isLoading && (
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-rose-900 mb-1">Complaint Not Found</h3>
          <p className="text-xs sm:text-sm text-rose-700 max-w-md mx-auto">{errorMessage}</p>
        </div>
      )}

      {/* Result Card */}
      {result && !isLoading && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Status Header Card */}
          <Card className="border-brand-200 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded border border-brand-200">
                  {result.complaint_id}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
                  {result.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <ComplaintStatusBadge status={result.status} />
              </div>
            </div>

            {/* Status explanation notice */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-brand-600 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-900">Current Phase: </span>
                <span>{STATUS_CONFIG[result.status]?.description || 'Complaint is being handled.'}</span>
              </div>
            </div>

            {/* Key Information Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 text-xs">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <FolderTree className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Category</span>
                  <span className="font-bold text-slate-800">{result.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Campus Location</span>
                  <span className="font-bold text-slate-800">{result.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Submitted Date</span>
                  <span className="font-medium text-slate-700">{formatDateTime(result.submitted_at)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Last Activity</span>
                  <span className="font-medium text-slate-700">{formatDateTime(result.updated_at)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Issue Summary
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                {result.description}
              </p>
            </div>
          </Card>

          {/* Official Resolution Card (If available) */}
          {result.resolution ? (
            <Card className="border-emerald-300 bg-gradient-to-r from-emerald-50/60 to-white shadow-subtle">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-emerald-950 text-sm sm:text-base">
                      Official Resolution from Chief Proctor Office
                    </h3>
                    {result.resolved_at && (
                      <span className="text-[11px] text-emerald-700 font-medium">
                        Resolved on {formatDateTime(result.resolved_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-900 mt-2 leading-relaxed whitespace-pre-wrap bg-white p-3.5 rounded-xl border border-emerald-200">
                    {result.resolution}
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>
                Investigation or maintenance in progress. The official resolution note will appear here once finalized by the proctor team.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Initial Guidance when no search done */}
      {!searched && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-slate-500 text-xs sm:text-sm shadow-subtle space-y-2">
          <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="font-medium text-slate-700">Need to check a previous submission?</p>
          <p className="max-w-md mx-auto text-slate-500">
            Paste the unique reference ID provided upon submission into the search bar above to inspect live action updates.
          </p>
        </div>
      )}
    </div>
  );
};
