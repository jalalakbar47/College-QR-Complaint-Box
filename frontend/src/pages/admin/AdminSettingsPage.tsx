import React, { useState } from 'react';
import {
  QrCode,
  RotateCcw,
  CheckCircle2,
  Server,
  Database,
} from 'lucide-react';
import { PrintableQRCard } from '../../components/qr/PrintableQRCard';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useLocations } from '../../hooks/useLocations';
import { apiService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { ENV } from '../../config/env';

export const AdminSettingsPage: React.FC = () => {
  const { locations } = useLocations();
  const { success } = useToast();

  const [selectedLocation, setSelectedLocation] = useState<string>('General Campus');
  const [customLocation, setCustomLocation] = useState<string>('');

  const activeLocation = customLocation.trim() || selectedLocation;
  
  // Format location-encoded QR target URL
  const complaintUrl =
    activeLocation === 'General Campus'
      ? `${ENV.CAMPUS_PORTAL_URL}/complaint`
      : `${ENV.CAMPUS_PORTAL_URL}/complaint?location=${encodeURIComponent(activeLocation)}`;

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
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Campus QR Studio & System Settings</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Generate printable institutional flyers, manage location QR codes, and review backend connectivity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: QR Poster Configurator & Live Print View */}
        <div className="lg:col-span-8 space-y-6">
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
