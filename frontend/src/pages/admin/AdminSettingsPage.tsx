import React, { useState } from 'react';
import {
  QrCode,
  RotateCcw,
  CheckCircle2,
  Server,
  Database,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Mail,
  Lock,
} from 'lucide-react';
import { PrintableQRCard } from '../../components/qr/PrintableQRCard';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useLocations } from '../../hooks/useLocations';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { ENV } from '../../config/env';

export const AdminSettingsPage: React.FC = () => {
  const { locations } = useLocations();
  const { admin, token } = useAuth();
  const { success, error: toastError } = useToast();

  const [selectedLocation, setSelectedLocation] = useState<string>('General Campus');
  const [customLocation, setCustomLocation] = useState<string>('');

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrent, setShowCurrent] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  const activeLocation = customLocation.trim() || selectedLocation;

  // Format location-encoded QR target URL
  const complaintUrl =
    activeLocation === 'General Campus'
      ? `${ENV.CAMPUS_PORTAL_URL}/complaint`
      : `${ENV.CAMPUS_PORTAL_URL}/complaint?location=${encodeURIComponent(activeLocation)}`;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (!currentPassword.trim()) {
      setPasswordFeedback({ text: 'Please enter your current password.', isError: true });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordFeedback({ text: 'New password must be at least 6 characters.', isError: true });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ text: 'New password and confirmation do not match.', isError: true });
      return;
    }

    if (!admin?.admin_id) {
      setPasswordFeedback({ text: 'No active admin session found. Please log in again.', isError: true });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await apiService.changePassword(
        admin.admin_id,
        currentPassword,
        newPassword,
        token || undefined
      );

      if (res.success) {
        success('Password updated successfully and saved to Google Sheets!');
        setPasswordFeedback({
          text: 'Password updated successfully and synced to your database.',
          isError: false,
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const msg = res.message || 'Failed to update password.';
        setPasswordFeedback({ text: msg, isError: true });
        toastError(msg);
      }
    } catch (err: any) {
      const msg = err?.message || 'Error communicating with backend.';
      setPasswordFeedback({ text: msg, isError: true });
      toastError(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleResetDb = () => {
    if (window.confirm('Are you sure you want to reset local simulation data to factory defaults?')) {
      apiService.resetLocalDatabase();
      success('Local simulation database reset to initial seed data.');
      setTimeout(() => window.location.reload(), 800);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Chief Proctor Settings & QR Studio</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your official administrative profile, update credentials, and generate campus flyers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Proctor Profile & Password Management + QR Studio */}
        <div className="lg:col-span-8 space-y-6">
          {/* Chief Proctor Profile & Password Management Card */}
          <Card className="border-slate-200">
            <CardHeader
              title={
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-600" />
                  <span>Chief Proctor Profile & Security</span>
                </div>
              }
              subtitle="Manage your credentials. Updates are saved directly to your Google Sheets database."
            />

            {/* Profile Overview Bar */}
            <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                  {admin?.name?.charAt(0) || 'P'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{admin?.name || 'Chief Proctor'}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Chief Proctor
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{admin?.email || 'chiefproctor@college.edu'}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block uppercase font-semibold">Admin ID</span>
                <span className="font-mono text-xs font-bold text-slate-700">{admin?.admin_id || 'ADM-001'}</span>
              </div>
            </div>

            {/* Password Change Form */}
            <form onSubmit={handleChangePassword} className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Lock className="w-4 h-4 text-brand-600" />
                <span>Change Security Passkey / Password</span>
              </div>

              {passwordFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium border ${
                    passwordFeedback.isError
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  }`}
                >
                  {passwordFeedback.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Input
                    label="Current Password"
                    type={showCurrent ? 'text' : 'password'}
                    placeholder="Current passkey"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    leftIcon={<KeyRound className="w-4 h-4 text-slate-400" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                        aria-label="Toggle current password visibility"
                      >
                        {showCurrent ? <EyeOff className="w-4 h-4 text-slate-600" /> : <Eye className="w-4 h-4 text-slate-400" />}
                      </button>
                    }
                  />
                </div>

                <div>
                  <Input
                    label="New Password"
                    type={showNew ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    leftIcon={<KeyRound className="w-4 h-4 text-slate-400" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                        aria-label="Toggle new password visibility"
                      >
                        {showNew ? <EyeOff className="w-4 h-4 text-slate-600" /> : <Eye className="w-4 h-4 text-slate-400" />}
                      </button>
                    }
                  />
                </div>

                <div>
                  <Input
                    label="Confirm New Password"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat new passkey"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    leftIcon={<KeyRound className="w-4 h-4 text-slate-400" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4 text-slate-600" /> : <Eye className="w-4 h-4 text-slate-400" />}
                      </button>
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isChangingPassword}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 shadow-sm"
                >
                  Save New Password & Sync Sheet
                </Button>
              </div>
            </form>
          </Card>

          {/* Campus Poster Customizer */}
          <Card>
            <CardHeader
              title={
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-brand-600" />
                  <span>Campus Poster Customizer</span>
                </div>
              }
              subtitle="Select or type a location to generate location-tagged QR codes."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Select
                label="Standard Location"
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setCustomLocation('');
                }}
                options={[
                  { value: 'General Campus', label: 'General Campus (All Zones)' },
                  ...locations.map((l) => ({
                    value: l.location_name,
                    label: l.location_name,
                  })),
                ]}
              />

              <Input
                label="Or Custom Location Title"
                placeholder="e.g. Mechanical Workshop Block 4"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                helperText="Encodes location parameter automatically into the QR URL"
              />
            </div>

            {/* Poster Preview */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-100 border border-slate-200">
              <PrintableQRCard
                locationName={activeLocation}
                complaintUrl={complaintUrl}
              />
            </div>
          </Card>
        </div>

        {/* Right Column: System & Environment Status */}
        <div className="lg:col-span-4 space-y-6">
          {/* Backend Connection Card */}
          <Card>
            <CardHeader
              title={
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-brand-600" />
                  <span>Backend Status</span>
                </div>
              }
            />

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[11px] font-semibold uppercase mb-1">
                  Active Mode
                </span>
                {ENV.IS_LIVE_API_CONFIGURED ? (
                  <div className="flex items-center gap-2 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Live Google Apps Script Web App</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-brand-700 font-bold">
                    <Database className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Local Development Mock Mode</span>
                  </div>
                )}
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-semibold uppercase mb-1">
                  Google Apps Script URL
                </span>
                <p className="font-mono text-[11px] text-slate-700 bg-slate-100 p-2.5 rounded-lg border border-slate-200 break-all">
                  {ENV.API_URL || 'Not configured (VITE_API_URL is empty)'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  To connect to your live Google Sheets database, deploy the script in <code className="bg-slate-200 px-1 py-0.5 rounded">apps-script/</code> and paste the Web App URL into <code className="bg-slate-200 px-1 py-0.5 rounded">.env</code>.
                </p>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-semibold uppercase mb-1">
                  Target Public Portal URL
                </span>
                <p className="font-mono text-[11px] text-slate-700 bg-slate-100 p-2 rounded-lg border border-slate-200 break-all">
                  {ENV.CAMPUS_PORTAL_URL}
                </p>
              </div>
            </div>
          </Card>

          {/* Database Reset Card (For dev & QA) */}
          <Card className="border-amber-200 bg-amber-50/20">
            <CardHeader
              title={
                <div className="flex items-center gap-2 text-amber-900">
                  <RotateCcw className="w-5 h-5 text-amber-600" />
                  <span>Developer Seed Reset</span>
                </div>
              }
              subtitle="Reset local test records to initial demo complaints."
            />

            <Button
              variant="secondary"
              size="sm"
              className="w-full text-xs font-semibold border-amber-300 hover:bg-amber-100/60 text-amber-900"
              onClick={handleResetDb}
              leftIcon={<RotateCcw className="w-3.5 h-3.5 text-amber-600" />}
            >
              Reset Seed Complaints & Logs
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
