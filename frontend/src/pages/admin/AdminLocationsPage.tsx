import React, { useState, useMemo } from 'react';
import {
  MapPin,
  QrCode,
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  Building,
  Check,
} from 'lucide-react';
import { useLocations } from '../../hooks/useLocations';
import { LocationItem } from '../../types';
import { apiService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { PrintableQRCard } from '../../components/qr/PrintableQRCard';
import { ENV } from '../../config/env';
import { useAuth } from '../../contexts/AuthContext';

// Default block/building mappings for campus locations
const DEFAULT_BUILDINGS: Record<string, string> = {
  'Lecture Halls': 'Main Academic Block (Floors 1–3)',
  'Computer Lab 1 & 2': 'IT & Science Complex (Block B)',
  'Hostels': 'Student Residential Quadrangle',
  'Cafeteria': 'Student Amenities & Dining Center',
  'College Entrance Gates': 'Main Campus Perimeter Gate 1 & 2',
  'Washrooms & Restrooms': 'All Academic & Common Blocks',
  'Library': 'Central Knowledge Resource Center',
  'Administration Block': 'Chief Proctor & Principal Office Complex',
};

function getLocationBuilding(loc: LocationItem): string {
  return loc.building_block || DEFAULT_BUILDINGS[loc.location_name] || 'General Campus Zone';
}

export const AdminLocationsPage: React.FC = () => {
  const { token } = useAuth();
  const { locations, isLoading, refetch } = useLocations();
  const { success, error } = useToast();

  // Local reorderable list
  const [localLocations, setLocalLocations] = useState<LocationItem[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Sync loaded locations to local list
  useMemo(() => {
    if (locations && locations.length > 0) {
      setLocalLocations(locations);
    }
  }, [locations]);

  // Selected location for print
  const [activePrintLocation, setActivePrintLocation] = useState<string>('General Campus');

  // Modals state
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);
  const [isAddingLocation, setIsAddingLocation] = useState<boolean>(false);
  const [deletingLocationId, setDeletingLocationId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState<string>('');
  const [formBuilding, setFormBuilding] = useState<string>('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const openAddModal = () => {
    setFormName('');
    setFormBuilding('');
    setFormStatus('Active');
    setIsAddingLocation(true);
  };

  const openEditModal = (loc: LocationItem) => {
    setEditingLocation(loc);
    setFormName(loc.location_name);
    setFormBuilding(loc.building_block || DEFAULT_BUILDINGS[loc.location_name] || '');
    setFormStatus(loc.status);
  };

  // Direct print trigger for a specific location
  const handlePrintLocationPoster = (locName: string) => {
    setActivePrintLocation(locName);
    setTimeout(() => {
      window.print();
    }, 50);
  };

  // Toggle active/inactive directly from row
  const handleToggleStatus = async (loc: LocationItem) => {
    const newStatus: 'Active' | 'Inactive' = loc.status === 'Active' ? 'Inactive' : 'Active';
    const updatedLoc: LocationItem = {
      ...loc,
      status: newStatus,
    };

    // Optimistic UI update
    setLocalLocations((prev) =>
      prev.map((l) => (l.location_id === loc.location_id ? updatedLoc : l))
    );

    try {
      const res = await apiService.saveLocation(updatedLoc, false, token || undefined);
      if (res.success) {
        success(`Location "${loc.location_name}" is now ${newStatus.toLowerCase()}.`);
        refetch();
      } else {
        error(res.message || 'Failed to update location status.');
        refetch();
      }
    } catch {
      error('Failed to update location status.');
      refetch();
    }
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
          building_block: formBuilding.trim() || 'General Campus Zone',
          status: formStatus,
        };
        const res = await apiService.saveLocation(newLoc, true, token || undefined);
        if (res.success) {
          success(`Location "${newLoc.location_name}" added successfully.`);
          setIsAddingLocation(false);
          refetch();
        } else {
          error(res.message || 'Failed to add location.');
        }
      } else if (editingLocation) {
        const updatedLoc: LocationItem = {
          ...editingLocation,
          location_name: formName.trim(),
          building_block: formBuilding.trim(),
          status: formStatus,
        };
        const res = await apiService.saveLocation(updatedLoc, false, token || undefined);
        if (res.success) {
          success(`Location "${updatedLoc.location_name}" updated successfully.`);
          setEditingLocation(null);
          refetch();
        } else {
          error(res.message || 'Failed to update location.');
        }
      }
    } catch {
      error('Failed to save location.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingLocationId) return;
    setIsSubmitting(true);
    try {
      const res = await apiService.deleteLocation(deletingLocationId, token || undefined);
      if (res.success) {
        success('Location removed successfully.');
        setDeletingLocationId(null);
        refetch();
      } else {
        error(res.message || 'Failed to delete location.');
      }
    } catch {
      error('An error occurred while deleting location.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Drag and drop reordering handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...localLocations];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setLocalLocations(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <>
      {/* Printable Poster DOM Element - Exclusively rendered during window.print() */}
      <div className="hidden print:block">
        <PrintableQRCard
          locationName={activePrintLocation}
          complaintUrl={`${ENV.CAMPUS_PORTAL_URL}/complaint?location=${encodeURIComponent(activePrintLocation)}`}
        />
      </div>

      {/* Screen Layout - Hidden during printing */}
      <div className="space-y-6 sm:space-y-8 animate-fade-in no-print">
        {/* 1. Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-normal text-ink-navy tracking-tight">
              Campus Locations
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted mt-0.5 font-sans">
              Manage the buildings and areas students can report issues from.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={openAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-sm text-xs font-medium px-4"
          >
            + Add Location
          </Button>
        </div>

        {/* 2. Location List Card */}
        {isLoading && locations.length === 0 ? (
          <div className="bg-paper-card rounded-xl border border-hairline p-6 shadow-sm">
            <TableSkeleton rows={8} />
          </div>
        ) : localLocations.length > 0 ? (
          <div className="bg-paper-card rounded-xl border border-hairline shadow-sm overflow-hidden">
            <div className="divide-y divide-hairline">
              {localLocations.map((loc, index) => {
                const buildingName = getLocationBuilding(loc);
                const isEven = index % 2 === 0;
                const isActive = loc.status === 'Active';

                return (
                  <div
                    key={loc.location_id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 transition-colors duration-150 group ${
                      isEven ? 'bg-paper-card' : 'bg-paper-recessed/60'
                    } ${draggedIndex === index ? 'opacity-40' : 'hover:bg-registrar-blue/5'}`}
                  >
                    {/* Left Side: Drag Handle + MapPin Icon Tile + Location Name & Building */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Drag Handle */}
                      <button
                        type="button"
                        className="cursor-grab active:cursor-grabbing text-ink-muted/50 hover:text-ink-navy transition-colors p-1 rounded -ml-1 focus:outline-none"
                        title="Drag to reorder"
                        aria-label="Drag to reorder"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>

                      {/* Icon Tile */}
                      <div className="w-10 h-10 rounded-lg bg-paper-recessed border border-hairline flex items-center justify-center text-registrar-blue flex-shrink-0 shadow-2xs group-hover:bg-registrar-blue/10 transition-colors">
                        <MapPin className="w-5 h-5" />
                      </div>

                      {/* Location Title & Block/Building Sub-line */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-ink-navy text-sm truncate">
                            {loc.location_name}
                          </h3>
                          <span className="font-mono text-[10px] text-ink-muted bg-paper-recessed px-1.5 py-0.5 rounded border border-hairline hidden md:inline-block">
                            {loc.location_id}
                          </span>
                        </div>
                        <p className="text-xs text-ink-muted truncate mt-0.5 font-sans">
                          Block / Building:{' '}
                          <span className="text-ink-navy font-medium">{buildingName}</span>
                        </p>
                      </div>
                    </div>

                    {/* Right Side: Direct Print Poster Button + Active Toggle + Edit & Delete Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pl-8 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-hairline">
                      {/* Direct Print Poster Button */}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handlePrintLocationPoster(loc.location_name)}
                        leftIcon={<QrCode className="w-3.5 h-3.5 text-registrar-blue" />}
                        className="text-xs font-medium text-registrar-blue border-registrar-blue/20 hover:bg-registrar-blue/10 px-2.5 py-1"
                        title="Print QR poster for this location"
                      >
                        Print Poster
                      </Button>

                      <div className="h-4 w-px bg-hairline hidden sm:block" />

                      {/* Active / Inactive Toggle Switch */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={isActive}
                          onClick={() => handleToggleStatus(loc)}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isActive ? 'bg-ledger-green' : 'bg-ink-muted/30'
                          }`}
                          title={`Click to ${isActive ? 'deactivate' : 'activate'} location`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              isActive ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span
                          className={`text-xs font-medium font-sans ${
                            isActive ? 'text-ledger-green' : 'text-ink-muted'
                          }`}
                        >
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="h-4 w-px bg-hairline hidden sm:block" />

                      {/* Edit & Delete Action Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(loc)}
                          className="p-1.5 rounded-lg text-ink-muted hover:text-registrar-blue hover:bg-registrar-blue/10 border border-transparent hover:border-registrar-blue/20 transition-colors"
                          title="Edit Location"
                          aria-label={`Edit location ${loc.location_name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingLocationId(loc.location_id)}
                          className="p-1.5 rounded-lg text-ink-muted hover:text-case-red hover:bg-case-red/10 border border-transparent hover:border-case-red/20 transition-colors"
                          title="Delete Location"
                          aria-label={`Delete location ${loc.location_name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* 3. Empty State */
          <div className="p-8 sm:p-12 rounded-xl bg-paper-card border border-hairline text-center text-ink-muted shadow-sm space-y-4 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-xl bg-paper-recessed border border-hairline flex items-center justify-center mx-auto text-ink-muted shadow-2xs">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-normal text-ink-navy">No locations yet</h3>
              <p className="text-xs sm:text-sm text-ink-muted max-w-sm mx-auto mt-1 leading-relaxed font-sans">
                Create campus locations to allow students to specify the exact area where issues occur.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={openAddModal}
                leftIcon={<Plus className="w-4 h-4" />}
                className="shadow-sm text-xs font-medium"
              >
                + Add Location
              </Button>
            </div>
          </div>
        )}

        {/* 4. Add / Edit Location Modal */}
        <Modal
          isOpen={isAddingLocation || Boolean(editingLocation)}
          onClose={() => {
            setIsAddingLocation(false);
            setEditingLocation(null);
          }}
          maxWidth="lg"
          title={isAddingLocation ? 'Add New Campus Location' : `Edit Location • ${editingLocation?.location_name}`}
        >
          <form onSubmit={handleSave} className="space-y-4">
            {/* Location Name */}
            <Input
              label="Location Name"
              requiredIndicator
              placeholder="e.g. Computer Lab 1 & 2 / 2nd Floor Restroom"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />

            {/* Block / Building (Optional) */}
            <Input
              label="Block / Building (Optional)"
              placeholder="e.g. IT & Science Complex (Block B)"
              value={formBuilding}
              onChange={(e) => setFormBuilding(e.target.value)}
              helperText="Campus building, floor level, or architectural wing."
            />

            {/* Status Toggle / Select */}
            <Select
              label="Visibility Status"
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Inactive')}
              options={[
                { value: 'Active', label: 'Active (Available on student complaint form)' },
                { value: 'Inactive', label: 'Inactive (Hidden from student complaint form)' },
              ]}
            />

            {/* Action Buttons */}
            <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-hairline">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsAddingLocation(false);
                  setEditingLocation(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmitting}
                leftIcon={<Check className="w-4 h-4" />}
              >
                {isAddingLocation ? 'Save Location' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* 5. Confirm Delete Dialog */}
        <ConfirmDialog
          isOpen={Boolean(deletingLocationId)}
          onClose={() => setDeletingLocationId(null)}
          onConfirm={handleDelete}
          title="Delete Location?"
          message="Are you sure you want to remove this location? Existing complaints tagged with this location will remain intact."
          confirmText="Delete Location"
          variant="danger"
          isLoading={isSubmitting}
        />
      </div>
    </>
  );
};
