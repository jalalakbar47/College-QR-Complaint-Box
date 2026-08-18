import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useAuth } from '../../contexts/AuthContext';
import { Category } from '../../types';
import { apiService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AdminCategoriesPage: React.FC = () => {
  const { token } = useAuth();
  const { categories, isLoading, refetch } = useCategories();
  const { success, error } = useToast();

  // Modals state
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState<string>('');
  const [formDesc, setFormDesc] = useState<string>('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const openAddModal = () => {
    setFormName('');
    setFormDesc('');
    setFormStatus('Active');
    setIsAddingCategory(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.category_name);
    setFormDesc(cat.description || '');
    setFormStatus(cat.status);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      error('Category name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isAddingCategory) {
        const newCat: Category = {
          category_id: `CAT-${Date.now().toString().slice(-4)}`,
          category_name: formName.trim(),
          description: formDesc.trim(),
          status: formStatus,
        };
        const res = await apiService.saveCategory(newCat, true, token || undefined);
        if (res.success) {
          success(`Category "${newCat.category_name}" added successfully.`);
          setIsAddingCategory(false);
        } else {
          error(res.message || 'Failed to add category.');
        }
      } else if (editingCategory) {
        const updatedCat: Category = {
          ...editingCategory,
          category_name: formName.trim(),
          description: formDesc.trim(),
          status: formStatus,
        };
        const res = await apiService.saveCategory(updatedCat, false, token || undefined);
        if (res.success) {
          success(`Category "${updatedCat.category_name}" updated successfully.`);
          setEditingCategory(null);
        } else {
          error(res.message || 'Failed to update category.');
        }
      }
      refetch();
    } catch {
      error('Failed to save category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategoryId) return;
    try {
      const res = await apiService.deleteCategory(deletingCategoryId, token || undefined);
      if (res.success) {
        success('Category removed successfully.');
      } else {
        error(res.message || 'Failed to delete category.');
      }
      setDeletingCategoryId(null);
      refetch();
    } catch {
      error('Failed to delete category.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Complaint Categories</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage classification categories used by students to submit campus complaints.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={openAddModal}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-sm"
        >
          Add Category
        </Button>
      </div>

      {/* Grid of Categories */}
      {isLoading ? (
        <LoadingSpinner size="lg" label="Loading category directory..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Card
              key={cat.category_id}
              className="p-4 sm:p-5 hover:border-brand-300 transition-all flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {cat.category_id}
                  </span>
                  <Badge variant={cat.status === 'Active' ? 'success' : 'neutral'} size="sm" dot>
                    {cat.status}
                  </Badge>
                </div>

                <h4 className="font-bold text-slate-900 text-base mb-1.5 flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span className="truncate">{cat.category_name}</span>
                </h4>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {cat.description || 'General grievance category for campus operations.'}
                </p>
              </div>

              {/* Action Buttons: View, Edit, Delete */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewingCategory(cat)}
                  className="text-xs text-slate-600 hover:text-brand-600 px-2.5"
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                >
                  View
                </Button>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(cat)}
                    className="text-xs px-2.5 text-slate-700 hover:bg-slate-50"
                    leftIcon={<Edit2 className="w-3.5 h-3.5 text-slate-500" />}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingCategoryId(cat.category_id)}
                    className="text-xs px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 1. View Category Modal */}
      <Modal
        isOpen={Boolean(viewingCategory)}
        onClose={() => setViewingCategory(null)}
        title="Category Information"
      >
        {viewingCategory && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-mono text-xs font-bold text-slate-600">{viewingCategory.category_id}</span>
              <Badge variant={viewingCategory.status === 'Active' ? 'success' : 'neutral'}>
                {viewingCategory.status}
              </Badge>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1">Category Name</span>
              <h3 className="text-lg font-bold text-slate-900">{viewingCategory.category_name}</h3>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1">Scope & Description</span>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {viewingCategory.description || 'No description provided.'}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <Link
                to={`/admin/complaints?category=${encodeURIComponent(viewingCategory.category_name)}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:underline"
              >
                <span>Filter complaints in this category</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <Button variant="outline" size="sm" onClick={() => setViewingCategory(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* 2. Add / Edit Category Modal */}
      <Modal
        isOpen={isAddingCategory || Boolean(editingCategory)}
        onClose={() => {
          setIsAddingCategory(false);
          setEditingCategory(null);
        }}
        title={isAddingCategory ? 'Add New Category' : `Edit Category • ${editingCategory?.category_name}`}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Category Name"
            requiredIndicator
            placeholder="e.g. Laboratory Equipment / Wi-Fi Network"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />

          <Textarea
            label="Description / Scope"
            placeholder="Explain what types of issues fall under this category..."
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
            className="min-h-[90px]"
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
                setIsAddingCategory(false);
                setEditingCategory(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              {isAddingCategory ? 'Create Category' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* 3. Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingCategoryId)}
        onClose={() => setDeletingCategoryId(null)}
        onConfirm={handleDelete}
        title="Delete Category?"
        message="Are you sure you want to remove this category? Existing complaints tagged with this category will remain intact."
        confirmText="Delete Category"
        variant="danger"
      />
    </div>
  );
};
