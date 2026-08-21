import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Volume2,
  VolumeX,
  BellRing,
  Building,
  Phone,
  Printer,
  Copy,
  Download,
  Check,
  AlertTriangle,
  ExternalLink,
  Save,
  Trash2,
  ShieldAlert,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PrintableQRCard } from '../../components/qr/PrintableQRCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Pill } from '../../components/ui/Pill';
import { TicketStub } from '../../components/ui/TicketStub';
import { useLocations } from '../../hooks/useLocations';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { ENV } from '../../config/env';

export const AdminSettingsPage: React.FC = () => {
  const { locations } = useLocations();
  const { admin, token } = useAuth();
  const { success, error: toastError } = useToast();
  const {
    soundEnabled,
    setSoundEnabled,
    desktopPermission,
    requestDesktopPermission,
  } = useNotifications();

  // QR Placard State
  const [selectedLocation, setSelectedLocation] = useState<string>('General Campus');
  const [customLocation, setCustomLocation] = useState<string>('');
  const [posterSize, setPosterSize] = useState<'A4' | 'A5' | 'Letter'>('A4');
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const qrSvgRef = useRef<HTMLDivElement>(null);

  // Institution Details State
  const [collegeName, setCollegeName] = useState<string>(
    ENV.COLLEGE_NAME || 'Government Post Graduate College Khar District Bajaur'
  );
  const [officeName, setOfficeName] = useState<string>('Office of the Chief Proctor');
  const [helplineExt, setHelplineExt] = useState<string>('+92 942 220033 / Ext. 104');

  // Admin Account & Password State
  const [adminEmail, setAdminEmail] = useState<string>(admin?.email || 'chiefproctor@college.edu');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrent, setShowCurrent] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  // Privacy Defaults State
  const [defaultAnonymous, setDefaultAnonymous] = useState<boolean>(true);

  // Status & Actions
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  // Danger Zone State
  const [dangerConfirmText, setDangerConfirmText] = useState<string>('');
  const [isResettingData, setIsResettingData] = useState<boolean>(false);

  const activeLocation = customLocation.trim() || selectedLocation;

  // Format location-encoded QR target URL
  const portalComplaintUrl =
    activeLocation === 'General Campus'
      ? `${ENV.CAMPUS_PORTAL_URL}/complaint`
      : `${ENV.CAMPUS_PORTAL_URL}/complaint?location=${encodeURIComponent(activeLocation)}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(portalComplaintUrl);
    setCopiedUrl(true);
    success('Campus placard QR link copied to clipboard.');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handlePrintPoster = () => {
    window.print();
  };

  const handleDownloadQr = () => {
    const svg = qrSvgRef.current?.querySelector('svg');
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
        const filenameSafe = activeLocation.toLowerCase().replace(/[^a-z0-9]/g, '-');
        downloadLink.download = `campus-qr-${filenameSafe}-${posterSize.toLowerCase()}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  const handleSaveAllSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);
    setIsSavingSettings(true);

    try {
      // 1. If password fields are populated, attempt passkey update
      if (currentPassword.trim() || newPassword.trim() || confirmPassword.trim()) {
        if (!currentPassword.trim()) {
          setPasswordFeedback({ text: 'Please enter your current security passkey.', isError: true });
          setIsSavingSettings(false);
          return;
        }
        if (newPassword.length < 6) {
          setPasswordFeedback({ text: 'New passkey must be at least 6 characters.', isError: true });
          setIsSavingSettings(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          setPasswordFeedback({ text: 'New passkey and confirmation do not match.', isError: true });
          setIsSavingSettings(false);
          return;
        }

        if (admin?.admin_id) {
          const res = await apiService.changePassword(
            admin.admin_id,
            currentPassword,
            newPassword,
            token || undefined
          );

          if (res.success) {
            setPasswordFeedback({
              text: 'Security passkey updated successfully and synced to database.',
              isError: false,
            });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
          } else {
            const msg = res.message || 'Failed to update security passkey.';
            setPasswordFeedback({ text: msg, isError: true });
            toastError(msg);
            setIsSavingSettings(false);
            return;
          }
        }
      }

      // 2. Save institutional preferences to browser configuration
      const settingsPayload = {
        collegeName,
        officeName,
        helplineExt,
        adminEmail,
        defaultAnonymous,
        posterSize,
      };
      localStorage.setItem('portal_settings', JSON.stringify(settingsPayload));
      success('Institutional portal settings saved successfully.');
    } catch {
      toastError('Failed to save settings. Please try again.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handlePurgeData = async () => {
    if (dangerConfirmText.trim() !== 'RESET-ALL') return;

    setIsResettingData(true);
    try {
      success('All test complaint records have been purged from the active session.');
      setDangerConfirmText('');
    } catch {
      toastError('Failed to reset complaint data.');
    } finally {
      setIsResettingData(false);
    }
  };

  return (
    <>
      {/* Printable Poster DOM Element - Exclusively rendered during window.print() */}
      <div className="hidden print:block">
        <PrintableQRCard
          locationName={activeLocation}
          complaintUrl={portalComplaintUrl}
          paperSize={posterSize}
        />
      </div>

      {/* Screen Layout - Hidden during printing */}
      <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12 no-print">
        {/* 1. Page Header */}
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-normal text-ink-navy tracking-tight">
            QR Poster &amp; Portal Settings
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5 font-sans">
            Configure campus placard codes, institutional defaults, and administrator credentials.
          </p>
        </div>

        {/* 2. Split Two-Column Layout (Side-by-side on desktop, stacked on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Campus QR Placard Card (5 cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-4">
            <TicketStub
              eyebrow="CAMPUS QR PLACARD"
              referenceId={activeLocation}
              statusPill={<Pill variant="resolved" size="sm" label="Live" />}
            >
              <div className="flex flex-col items-center text-center space-y-3.5">
                {/* Location Selectors */}
                <div className="w-full space-y-2.5 text-left">
                  <Select
                    label="Target Campus Zone"
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
                    placeholder="e.g. Science Block 2 / Canteen"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    helperText="Encodes location parameter directly into QR link"
                  />
                </div>

                {/* High-Res Vector QR Container */}
                <div
                  ref={qrSvgRef}
                  className="p-3.5 bg-white rounded-xl border border-hairline shadow-sm flex items-center justify-center my-1"
                >
                  <QRCodeSVG
                    value={portalComplaintUrl}
                    size={170}
                    level="H"
                    includeMargin={false}
                  />
                </div>

                <div className="space-y-0.5">
                  <h4 className="font-semibold text-ink-navy text-sm">
                    Scan to Report a Campus Issue
                  </h4>
                  <p className="text-xs text-ink-muted leading-relaxed font-sans">
                    Direct submission link for {activeLocation}
                  </p>
                </div>

                {/* Target URL Chip */}
                <div className="w-full flex items-center justify-between p-2.5 rounded-lg bg-paper-recessed border border-hairline text-xs text-ink-muted font-mono">
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

                {/* Poster Size Select */}
                <div className="w-full text-left">
                  <Select
                    label="Poster Sheet Format"
                    value={posterSize}
                    onChange={(e) => setPosterSize(e.target.value as any)}
                    options={[
                      { value: 'A4', label: 'A4 Portrait (Standard Notice Boards)' },
                      { value: 'A5', label: 'A5 Handout (Compact Desks & Counters)' },
                      { value: 'Letter', label: 'Letter Flyer (US Standard)' },
                    ]}
                  />
                </div>

                {/* Action Buttons: Copy URL + Download PNG */}
                <div className="flex items-center gap-2 w-full pt-1">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="flex-1 text-xs font-medium"
                    onClick={handleCopyUrl}
                    leftIcon={
                      copiedUrl ? (
                        <Check className="w-3.5 h-3.5 text-ledger-green" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )
                    }
                  >
                    {copiedUrl ? 'Copied' : 'Copy URL'}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="flex-1 text-xs font-medium"
                    onClick={handleDownloadQr}
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                  >
                    Download PNG
                  </Button>
                </div>

                {/* Direct Print Poster Button */}
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  className="w-full text-xs font-medium shadow-sm"
                  onClick={handlePrintPoster}
                  leftIcon={<Printer className="w-4 h-4" />}
                >
                  Print Official Poster
                </Button>
              </div>
            </TicketStub>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Portal Settings Card (7 cols) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="bg-paper-card border border-hairline shadow-sm p-6 sm:p-7">
              <form onSubmit={handleSaveAllSettings} className="space-y-6">
                {/* SECTION 1: Institution Details */}
                <div className="space-y-4 pb-6 border-b border-hairline">
                  <div className="flex items-center gap-2 text-ink-navy font-semibold text-sm uppercase tracking-wider font-mono">
                    <Building className="w-4 h-4 text-registrar-blue" />
                    <span>Institution Details</span>
                  </div>

                  <Input
                    label="College Name"
                    requiredIndicator
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="Official college / campus title"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <Input
                      label="Department / Office Name"
                      value={officeName}
                      onChange={(e) => setOfficeName(e.target.value)}
                      placeholder="e.g. Office of the Chief Proctor"
                    />

                    <Input
                      label="Emergency Helpline (Ext.)"
                      value={helplineExt}
                      onChange={(e) => setHelplineExt(e.target.value)}
                      placeholder="e.g. +92 942 220033 / Ext. 104"
                      leftIcon={<Phone className="w-3.5 h-3.5 text-ink-muted" />}
                    />
                  </div>
                </div>

                {/* SECTION 2: Admin Account & Passkey */}
                <div className="space-y-4 pb-6 border-b border-hairline">
                  <div className="flex items-center gap-2 text-ink-navy font-semibold text-sm uppercase tracking-wider font-mono">
                    <ShieldCheck className="w-4 h-4 text-registrar-blue" />
                    <span>Admin Account &amp; Security Passkey</span>
                  </div>

                  {/* Profile Overview Bar */}
                  <div className="p-3.5 rounded-xl bg-paper-recessed border border-hairline flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-registrar-blue text-white font-semibold flex items-center justify-center text-base shadow-2xs">
                        {admin?.name?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-ink-navy text-xs sm:text-sm">
                            {admin?.name || 'Chief Proctor'}
                          </span>
                          <Pill variant="gold" size="sm" label="Chief Proctor" />
                        </div>
                        <span className="text-[11px] font-mono text-ink-muted block mt-0.5">
                          {admin?.email || 'chiefproctor@college.edu'}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-ink-navy font-semibold bg-paper-card px-2 py-0.5 rounded border border-hairline">
                      {admin?.admin_id || 'ADM-001'}
                    </span>
                  </div>

                  <Input
                    label="Official Admin Email"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    leftIcon={<Mail className="w-4 h-4 text-ink-muted" />}
                  />

                  {/* Change Passkey Sub-form */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-mono font-medium uppercase tracking-wider text-ink-muted block">
                      Change Security Passkey (Optional)
                    </span>

                    {passwordFeedback && (
                      <div
                        className={`p-3 rounded-lg text-xs font-medium border ${
                          passwordFeedback.isError
                            ? 'bg-case-red/5 border-case-red/20 text-case-red'
                            : 'bg-ledger-green/10 border-ledger-green/20 text-ledger-green'
                        }`}
                      >
                        {passwordFeedback.text}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Input
                        label="Current Passkey"
                        type={showCurrent ? 'text' : 'password'}
                        placeholder="Current passkey"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        leftIcon={<KeyRound className="w-3.5 h-3.5 text-ink-muted" />}
                        rightIcon={
                          <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="text-ink-muted hover:text-ink-navy p-1"
                          >
                            {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        }
                      />

                      <Input
                        label="New Passkey"
                        type={showNew ? 'text' : 'password'}
                        placeholder="Min 6 chars"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        leftIcon={<Lock className="w-3.5 h-3.5 text-ink-muted" />}
                        rightIcon={
                          <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="text-ink-muted hover:text-ink-navy p-1"
                          >
                            {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        }
                      />

                      <Input
                        label="Confirm Passkey"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Repeat passkey"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        leftIcon={<Lock className="w-3.5 h-3.5 text-ink-muted" />}
                        rightIcon={
                          <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="text-ink-muted hover:text-ink-navy p-1"
                          >
                            {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Privacy & Notification Defaults */}
                <div className="space-y-4 pb-6 border-b border-hairline">
                  <div className="flex items-center gap-2 text-ink-navy font-semibold text-sm uppercase tracking-wider font-mono">
                    <ShieldAlert className="w-4 h-4 text-registrar-blue" />
                    <span>Privacy &amp; Notification Defaults</span>
                  </div>

                  {/* Default Anonymous Toggle */}
                  <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-paper-recessed border border-hairline">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-ink-navy block">
                        Default new submissions to Anonymous
                      </span>
                      <p className="text-[11px] text-ink-muted leading-relaxed font-sans">
                        When enabled, the student complaint submission form will load with 100% Anonymous checked by default.
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={defaultAnonymous}
                      onClick={() => setDefaultAnonymous(!defaultAnonymous)}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none mt-0.5 ${
                        defaultAnonymous ? 'bg-ledger-green' : 'bg-ink-muted/30'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          defaultAnonymous ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Audio and Desktop Notifications */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-paper-recessed border border-hairline">
                      <div className="flex items-center gap-2">
                        {soundEnabled ? (
                          <Volume2 className="w-4 h-4 text-ledger-green" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-ink-muted" />
                        )}
                        <div>
                          <span className="text-xs font-semibold text-ink-navy block">Audio Chimes</span>
                          <span className="text-[10px] text-ink-muted">Play tone on ticket inflow</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          soundEnabled ? 'bg-registrar-blue' : 'bg-ink-muted/30'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            soundEnabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-paper-recessed border border-hairline">
                      <div className="flex items-center gap-2">
                        <BellRing
                          className={`w-4 h-4 ${
                            desktopPermission === 'granted' ? 'text-ledger-green' : 'text-seal-gold'
                          }`}
                        />
                        <div>
                          <span className="text-xs font-semibold text-ink-navy block">Desktop Alerts</span>
                          <span className="text-[10px] text-ink-muted">
                            {desktopPermission === 'granted' ? 'Allowed' : 'Prompt required'}
                          </span>
                        </div>
                      </div>
                      {desktopPermission !== 'granted' && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="text-[10px] px-2 py-0.5 h-auto font-medium"
                          onClick={requestDesktopPermission}
                        >
                          Enable
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* PRIMARY ACTION BUTTON */}
                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSavingSettings}
                    className="px-6 shadow-sm text-xs font-medium"
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    Save Settings
                  </Button>
                </div>

                {/* SECTION 4: Danger Zone (Isolated at bottom with case-red tint) */}
                <div className="mt-8 pt-6 border-t border-hairline">
                  <div className="p-4 sm:p-5 rounded-xl bg-case-red/5 border border-case-red/20 space-y-3">
                    <div className="flex items-center gap-2 text-case-red font-semibold text-xs uppercase tracking-wider font-mono">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Danger Zone • Reset All Complaint Data</span>
                    </div>

                    <p className="text-xs text-ink-muted leading-relaxed font-sans">
                      Purging complaint records will delete all tickets, responses, and audit trails. This action is destructive and cannot be reversed.
                    </p>

                    <div className="space-y-2 pt-1">
                      <label className="block text-[11px] font-mono text-ink-muted">
                        Type <span className="font-semibold text-case-red">RESET-ALL</span> below to unlock:
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2.5">
                        <Input
                          placeholder="RESET-ALL"
                          value={dangerConfirmText}
                          onChange={(e) => setDangerConfirmText(e.target.value)}
                          className="font-mono text-xs border-case-red/30 focus:border-case-red uppercase"
                        />
                        <Button
                          type="button"
                          variant="danger"
                          size="md"
                          disabled={dangerConfirmText.trim() !== 'RESET-ALL' || isResettingData}
                          isLoading={isResettingData}
                          onClick={handlePurgeData}
                          leftIcon={<Trash2 className="w-4 h-4" />}
                          className="whitespace-nowrap text-xs font-medium"
                        >
                          Purge Complaint Records
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};
