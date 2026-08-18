import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  QrCode,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { useLocations } from '../../hooks/useLocations';
import { LocationItem } from '../../types';
import { apiService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { PrintableQRCard } from '../../components/qr/PrintableQRCard';
import { ENV } from '../../config/env';

import { useAuth } from '../../contexts/AuthContext';

export const AdminLocationsPage: React.FC = () => {
  const { token } = useAuth();
  const { locations, isLoading, refetch } = useLocations();
  const { success, error } = useToast();

  // Modals state
  const [selectedLocationForQr, setSelectedLocationForQr] = useState<string | null>(null);
  const [viewingLocation, setViewingLocation] = useState<LocationItem | null>(null);
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);
  const [isAddingLocation, setIsAddingLocation] = useState<boolean>(false);
  const [deletingLocationId, setDeletingLocationId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState<string>('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const openAddModal = () => {
    setFormName('');
    setFormStatus('Active');
    setIsAddingLocation(true);
  };

  const openEditModal = (loc: LocationItem) => {
    setEditingLocation(loc);
    setFormName(loc.location_name);
    setFormStatus(loc.status);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      error('Location name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isAddingLocation) {
        const newLoc: LocationItem = {
          location_id: `LOC-${Date.now().toString().slice(-4)}`,
          location_name: formName.trim(),
          status: formStatus,
        };
        const res = await apiService.saveLocation(newLoc, true, token || undefined);
        if (res.success) {
          success(`Location "${newLoc.location_name}" added successfully.`);
          setIsAddingLocation(false);
        } else {
          error(res.message || 'Failed to add location.');
        }
      } else if (editingLocation) {
        const updatedLoc: LocationItem = {
          ...editingLocation,
          location_name: formName.trim(),
          status: formStatus,
        };
        const res = await apiService.saveLocation(updatedLoc, false, token || undefined);
        if (res.success) {
          success(`Location "${updatedLoc.location_name}" updated successfully.`);
          setEditingLocation(null);
        } else {
          error(res.message || 'Failed to update location.');
        }
      }
      refetch();
    } catch {
      error('Failed to save location.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingLocationId) return;
    try {
      const res = await apiService.deleteLocation(deletingLocationId, token || undefined);
      if (res.success) {
        success('Location removed successfully.');
      } else {
        error(res.message || 'Failed to delete location.');
      }
      setDeletingLocationId(null);
      refetch();
    } catch {
      error('Failed to delete location.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Campus Locations</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage physical campus zones and generate location-specific QR notice placards.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={openAddModal}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-sm"
        >
          Add Location
        </Button>
      </div>

      {/* Grid of Locations */}
      {isLoading ? (
        <LoadingSpinner size="lg" label="Loading location directory..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((loc) => (
            <Card
              key={loc.location_id}
              className="p-4 sm:p-5 hover:border-brand-300 transition-all flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {loc.location_id}
                  </span>
                  <Badge variant={loc.status === 'Active' ? 'success' : 'neutral'} size="sm" dot>
                    {loc.status}
                  </Badge>
                </div>

                <h4 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span className="truncate">{loc.location_name}</span>
                </h4>
              </div>

              {/* Action Buttons: QR Poster, View, Edit, Delete */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold text-brand-700 bg-brand-50/50 hover:bg-brand-100/70 border-brand-200"
                  onClick={() => setSelectedLocationForQr(loc.location_name)}
                  leftIcon={<QrCode className="w-3.5 h-3.5" />}
                >
                  Generate QR Poster
                </Button>

                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewingLocation(loc)}
                    className="text-xs text-slate-600 hover:text-brand-600 px-2"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    View
                  </Button>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(loc)}
                      className="text-xs px-2.5 text-slate-700 hover:bg-slate-50"
                      leftIcon={<Edit2 className="w-3.5 h-3.5 text-slate-500" />}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingLocationId(loc.location_id)}
                      className="text-xs px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 1. Modal for Location QR Poster */}
      <Modal
        isOpen={Boolean(selectedLocationForQr)}
        onClose={() => setSelectedLocationForQr(null)}
        maxWidth="xl"
        title={`Campus QR Poster • ${selectedLocationForQr}`}
      >
        {selectedLocationForQr && (
          <PrintableQRCard
            locationName={selectedLocationForQr}
            complaintUrl={`${ENV.CAMPUS_PORTAL_URL}/complaint?location=${encodeURIComponent(selectedLocationForQr)}`}
          />
        )}
      </Modal>

      {/* 2. View Location Modal */}
      <Modal
        isOpen={Boolean(viewingLocation)}
        onClose={() => setViewingLocation(null)}
        title="Location Information"
      >
        {viewingLocation && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-mono text-xs font-bold text-slate-600">{viewingLocation.location_id}</span>
              <Badge variant={viewingLocation.status === 'Active' ? 'success' : 'neutral'}>
                {viewingLocation.status}
              </Badge>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1">Campus Zone / Building</span>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-600" />
                <span>{viewingLocation.location_name}</span>
              </h3>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-semibold text-slate-700 block">QR Direct URL:</span>
              <p className="font-mono text-[11px] text-brand-700 break-all">
                {`${ENV.CAMPUS_PORTAL_URL}/complaint?location=${encodeURIComponent(viewingLocation.location_name)}`}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <Link
                to={`/admin/complaints?location=${encodeURIComponent(viewingLocation.location_name)}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline"
              >
                <span>Filter complaints in this location</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <Button variant="outline" size="sm" onClick={() => setViewingLocation(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* 3. Add / Edit Location Modal */}
      <Modal
        isOpen={isAddingLocation || Boolean(editingLocation)}
        onClose={() => {
          setIsAddingLocation(false);
          setEditingLocation(null);
        }}
        title={isAddingLocation ? 'Add New Campus Location' : `Edit Location • ${editingLocation?.location_name}`}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Location Name"
            requiredIndicator
            placeholder="e.g. Mechanical Lab Block B / 2nd Floor Restroom"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />

          <Select
            label="Status"
            value={formStatus}
            onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Inactive')}
            options={[
              { value: 'Active', label: 'Active (Available on student complaint form)' },
              { value: 'Inactive', label: 'Inactive (Hidden from student complaint form)' },
            ]}
          />

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddingLocation(false);
                setEditingLocation(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              {isAddingLocation ? 'Create Location' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* 4. Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingLocationId)}
        onClose={() => setDeletingLocationId(null)}
        onConfirm={handleDelete}
        title="Delete Location?"
        message="Are you sure you want to remove this location? Existing complaints tagged with this location will remain intact."
        confirmText="Delete Location"
        variant="danger"
      />
    </div>
  );
};
