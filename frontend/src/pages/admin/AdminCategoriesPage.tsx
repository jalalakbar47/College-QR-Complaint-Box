import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  GripVertical,
  BookOpen,
  GraduationCap,
  ShieldAlert,
  UserX,
  Building,
  Zap,
  Sparkles,
  Droplets,
  Wifi,
  Bus,
  Wrench,
  FileText,
  Bell,
  AlertCircle,
  HeartHandshake,
  ShieldCheck,
  FolderTree,
  Check,
} from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useAuth } from '../../contexts/AuthContext';
import { Category } from '../../types';
import { apiService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { TableSkeleton } from '../../components/ui/Skeleton';

// Available icons for category picker
export const ICON_OPTIONS: { name: string; label: string; icon: React.FC<{ className?: string }> }[] = [
  { name: 'BookOpen', label: 'Academics', icon: BookOpen },
  { name: 'GraduationCap', label: 'Exams & Grades', icon: GraduationCap },
  { name: 'ShieldAlert', label: 'Safety & Security', icon: ShieldAlert },
  { name: 'UserX', label: 'Anti-Ragging', icon: UserX },
  { name: 'Building', label: 'Infrastructure', icon: Building },
  { name: 'Zap', label: 'Electricity', icon: Zap },
  { name: 'Sparkles', label: 'Cleanliness', icon: Sparkles },
  { name: 'Droplets', label: 'Water & Hygiene', icon: Droplets },
  { name: 'Wifi', label: 'IT & Wi-Fi', icon: Wifi },
  { name: 'Bus', label: 'Transport', icon: Bus },
  { name: 'Wrench', label: 'Maintenance', icon: Wrench },
  { name: 'FileText', label: 'Administration', icon: FileText },
  { name: 'Bell', label: 'Notice & Alerts', icon: Bell },
  { name: 'HeartHandshake', label: 'Student Welfare', icon: HeartHandshake },
  { name: 'ShieldCheck', label: 'Discipline', icon: ShieldCheck },
  { name: 'AlertCircle', label: 'Emergency', icon: AlertCircle },
];

// Default department liaison mappings for institutional categories
const DEFAULT_LIAISONS: Record<string, string> = {
  'Academic & Lectures': 'Academic Affairs & HoD Office',
  'Examination & Grades': 'Controller of Examinations Office',
  'Harassment & Safety': 'Chief Proctor & Discipline Committee',
  'Anti-Bullying & Ragging': 'Anti-Ragging Cell & Student Affairs',
  'Infrastructure & Labs': 'Campus Works & Civil Maintenance',
  'Electricity & Backup': 'Electrical Engineering Cell',
  'Cleanliness & Hygiene': 'Campus Sanitation & Housekeeping',
  'Drinking Water & Restrooms': 'Public Health & Plumbing Maintenance',
  'Campus Wi-Fi & IT Labs': 'IT & Network Operations Center',
  'College Transport Buses': 'Transport Office & Fleet In-Charge',
};

// Default category icons
const DEFAULT_ICONS: Record<string, string> = {
  'Academic & Lectures': 'BookOpen',
  'Examination & Grades': 'GraduationCap',
  'Harassment & Safety': 'ShieldAlert',
  'Anti-Bullying & Ragging': 'UserX',
  'Infrastructure & Labs': 'Building',
  'Electricity & Backup': 'Zap',
  'Cleanliness & Hygiene': 'Sparkles',
  'Drinking Water & Restrooms': 'Droplets',
  'Campus Wi-Fi & IT Labs': 'Wifi',
  'College Transport Buses': 'Bus',
};

function getCategoryIconComponent(cat: Category) {
  const iconKey = cat.icon_name || DEFAULT_ICONS[cat.category_name] || 'FolderTree';
  const found = ICON_OPTIONS.find((opt) => opt.name === iconKey);
  return found ? found.icon : FolderTree;
}

function getCategoryLiaison(cat: Category): string {
  return cat.department_liaison || DEFAULT_LIAISONS[cat.category_name] || 'Chief Proctor Office';
}

export const AdminCategoriesPage: React.FC = () => {
  const { token } = useAuth();
  const { categories, isLoading, refetch } = useCategories();
  const { success, error } = useToast();

  // Local reorderable list
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Sync loaded categories to local list
  useMemo(() => {
    if (categories && categories.length > 0) {
      setLocalCategories(categories);
    }
  }, [categories]);

  // Modals state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formLiaison, setFormLiaison] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formIcon, setFormIcon] = useState('BookOpen');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddModal = () => {
    setFormName('');
    setFormLiaison('');
    setFormDesc('');
    setFormIcon('BookOpen');
    setFormStatus('Active');
    setIsAddingCategory(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.category_name);
    setFormLiaison(getCategoryLiaison(cat));
    setFormDesc(cat.description || '');
    setFormIcon(cat.icon_name || DEFAULT_ICONS[cat.category_name] || 'FolderTree');
    setFormStatus(cat.status);
  };

  // Toggle active/inactive directly from row
  const handleToggleStatus = async (cat: Category) => {
    const newStatus: 'Active' | 'Inactive' = cat.status === 'Active' ? 'Inactive' : 'Active';
    const updatedCat: Category = {
      ...cat,
      status: newStatus,
    };

    // Optimistic UI update
    setLocalCategories((prev) =>
      prev.map((c) => (c.category_id === cat.category_id ? updatedCat : c))
    );

    try {
      const res = await apiService.saveCategory(updatedCat, false, token || undefined);
      if (res.success) {
        success(`Category "${cat.category_name}" is now ${newStatus.toLowerCase()}.`);
        refetch();
      } else {
        error(res.message || 'Failed to update category status.');
        refetch();
      }
    } catch {
      error('Failed to update category status.');
      refetch();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      error('Category name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        // Update
        const updatedCat: Category = {
          ...editingCategory,
          category_name: formName.trim(),
          department_liaison: formLiaison.trim(),
          icon_name: formIcon,
          description: formDesc.trim(),
          status: formStatus,
        };
        const res = await apiService.saveCategory(updatedCat, false, token || undefined);
        if (res.success) {
          success(`Category "${formName}" updated successfully.`);
          setEditingCategory(null);
          refetch();
        } else {
          error(res.message || 'Failed to update category.');
        }
      } else {
        // Create
        const newCat: Category = {
          category_id: `CAT-${Date.now().toString().slice(-4)}`,
          category_name: formName.trim(),
          department_liaison: formLiaison.trim() || 'Chief Proctor Office',
          icon_name: formIcon,
          description: formDesc.trim(),
          status: formStatus,
        };
        const res = await apiService.saveCategory(newCat, true, token || undefined);
        if (res.success) {
          success(`Category "${formName}" created successfully.`);
          setIsAddingCategory(false);
          refetch();
        } else {
          error(res.message || 'Failed to create category.');
        }
      }
    } catch {
      error('An error occurred while saving category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategoryId) return;
    setIsSubmitting(true);
    try {
      const res = await apiService.deleteCategory(deletingCategoryId, token || undefined);
      if (res.success) {
        success('Category removed successfully.');
        setDeletingCategoryId(null);
        refetch();
      } else {
        error(res.message || 'Failed to delete category.');
      }
    } catch {
      error('An error occurred while deleting category.');
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

    const updated = [...localCategories];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setLocalCategories(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-normal text-ink-navy tracking-tight">
            Complaint Categories
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5 font-sans">
            Manage the issue types students can select when filing a complaint.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={openAddModal}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-sm text-xs font-medium px-4"
        >
          + Add Category
        </Button>
      </div>

      {/* 2. Category List Card */}
      {isLoading && categories.length === 0 ? (
        <div className="bg-paper-card rounded-xl border border-hairline p-6 shadow-sm">
          <TableSkeleton rows={8} />
        </div>
      ) : localCategories.length > 0 ? (
        <div className="bg-paper-card rounded-xl border border-hairline shadow-sm overflow-hidden">
          <div className="divide-y divide-hairline">
            {localCategories.map((cat, index) => {
              const IconComponent = getCategoryIconComponent(cat);
              const liaison = getCategoryLiaison(cat);
              const isEven = index % 2 === 0;
              const isActive = cat.status === 'Active';

              return (
                <div
                  key={cat.category_id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 transition-colors duration-150 group ${
                    isEven ? 'bg-paper-card' : 'bg-paper-recessed/60'
                  } ${draggedIndex === index ? 'opacity-40' : 'hover:bg-registrar-blue/5'}`}
                >
                  {/* Left Side: Drag Handle + Icon Tile + Category Name & Liaison */}
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
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Category Title & Department Liaison Sub-line */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-ink-navy text-sm truncate">
                          {cat.category_name}
                        </h3>
                        <span className="font-mono text-[10px] text-ink-muted bg-paper-recessed px-1.5 py-0.5 rounded border border-hairline hidden md:inline-block">
                          {cat.category_id}
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted truncate mt-0.5 font-sans">
                        Department liaison:{' '}
                        <span className="text-ink-navy font-medium">{liaison}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Active/Inactive Toggle Switch + Edit & Delete Buttons */}
                  <div className="flex items-center justify-between sm:justify-end gap-3.5 pl-8 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-hairline">
                    {/* Active / Inactive Toggle Switch */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isActive}
                        onClick={() => handleToggleStatus(cat)}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isActive ? 'bg-ledger-green' : 'bg-ink-muted/30'
                        }`}
                        title={`Click to ${isActive ? 'deactivate' : 'activate'} category`}
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
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 rounded-lg text-ink-muted hover:text-registrar-blue hover:bg-registrar-blue/10 border border-transparent hover:border-registrar-blue/20 transition-colors"
                        title="Edit Category"
                        aria-label={`Edit category ${cat.category_name}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingCategoryId(cat.category_id)}
                        className="p-1.5 rounded-lg text-ink-muted hover:text-case-red hover:bg-case-red/10 border border-transparent hover:border-case-red/20 transition-colors"
                        title="Delete Category"
                        aria-label={`Delete category ${cat.category_name}`}
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
        /* 3. Empty State (per design system's voice guidance) */
        <div className="p-8 sm:p-12 rounded-xl bg-paper-card border border-hairline text-center text-ink-muted shadow-sm space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-paper-recessed border border-hairline flex items-center justify-center mx-auto text-ink-muted shadow-2xs">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-normal text-ink-navy">No categories yet</h3>
            <p className="text-xs sm:text-sm text-ink-muted max-w-sm mx-auto mt-1 leading-relaxed font-sans">
              Create your first complaint category to allow students to file issues under specific departments.
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
              + Add Category
            </Button>
          </div>
        </div>
      )}

      {/* 4. Add / Edit Category Modal */}
      <Modal
        isOpen={isAddingCategory || Boolean(editingCategory)}
        onClose={() => {
          setIsAddingCategory(false);
          setEditingCategory(null);
        }}
        maxWidth="lg"
        title={isAddingCategory ? 'Add New Category' : `Edit Category • ${editingCategory?.category_name}`}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {/* Category Name */}
          <Input
            label="Category Name"
            requiredIndicator
            placeholder="e.g. Campus Wi-Fi & IT Labs"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />

          {/* Department Liaison */}
          <Input
            label="Department Liaison"
            placeholder="e.g. IT & Network Operations Center"
            value={formLiaison}
            onChange={(e) => setFormLiaison(e.target.value)}
            helperText="Staff office or committee liaison responsible for evaluating this category."
          />

          {/* Icon Picker */}
          <div>
            <label className="block text-xs font-mono font-medium text-ink-navy uppercase tracking-wider mb-2">
              Category Icon
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2 bg-paper-recessed rounded-xl border border-hairline">
              {ICON_OPTIONS.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = formIcon === opt.name;
                return (
                  <button
                    type="button"
                    key={opt.name}
                    onClick={() => setFormIcon(opt.name)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-registrar-blue/10 border-registrar-blue text-registrar-blue ring-2 ring-registrar-blue shadow-2xs'
                        : 'bg-paper-card border-hairline text-ink-muted hover:border-registrar-blue/40 hover:text-ink-navy'
                    }`}
                    title={opt.label}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-[9px] truncate w-full text-center mt-1 font-mono">
                      {opt.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description / Scope */}
          <Textarea
            label="Description / Scope (Optional)"
            placeholder="Explain what types of issues fall under this category..."
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
            className="min-h-[80px]"
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
                setIsAddingCategory(false);
                setEditingCategory(null);
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
              {isAddingCategory ? 'Save Category' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* 5. Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingCategoryId)}
        onClose={() => setDeletingCategoryId(null)}
        onConfirm={handleDelete}
        title="Delete Category?"
        message="Are you sure you want to remove this category? Existing complaints tagged with this category will remain intact."
        confirmText="Delete Category"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
};
