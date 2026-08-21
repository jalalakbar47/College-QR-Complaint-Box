import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  Send,
  User,
  FolderTree,
  FileText,
  EyeOff,
  Info,
} from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useLocations } from '../../hooks/useLocations';
import { DEPARTMENTS, FORM_LIMITS, SEMESTERS } from '../../config/constants';
import { SubmitComplaintDTO } from '../../types';
import { validateComplaintForm } from '../../utils/validation';
import { apiService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader } from '../../components/ui/Card';

export const ComplaintFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationFromUrl = searchParams.get('location') || searchParams.get('loc') || '';
  const categoryFromUrl = searchParams.get('category') || searchParams.get('cat') || '';

  const { categories, isLoading: loadingCategories } = useCategories();
  const { locations, isLoading: loadingLocations } = useLocations();
  const { error: toastError } = useToast();

  const [formData, setFormData] = useState<SubmitComplaintDTO>({
    category: '',
    location: '',
    title: '',
    description: '',
    is_anonymous: true, // default to anonymous for student safety
    student_name: '',
    student_id: '',
    department: '',
    semester: '',
    contact: '',
  });

  // Pre-select category and location if passed in URL via QR code scanning
  useEffect(() => {
    if (locationFromUrl && locations.length > 0) {
      const matchLoc = locations.find(
        (l) =>
          l.location_name.toLowerCase() === locationFromUrl.toLowerCase() ||
          l.location_id.toLowerCase() === locationFromUrl.toLowerCase()
      );
      if (matchLoc) {
        setFormData((prev) => ({ ...prev, location: matchLoc.location_name }));
      } else {
        setFormData((prev) => ({ ...prev, location: locationFromUrl }));
      }
    }

    if (categoryFromUrl && categories.length > 0) {
      const matchCat = categories.find(
        (c) =>
          c.category_name.toLowerCase() === categoryFromUrl.toLowerCase() ||
          c.category_id.toLowerCase() === categoryFromUrl.toLowerCase()
      );
      if (matchCat) {
        setFormData((prev) => ({ ...prev, category: matchCat.category_name }));
      } else {
        setFormData((prev) => ({ ...prev, category: categoryFromUrl }));
      }
    }
  }, [locationFromUrl, categoryFromUrl, locations, categories]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const selectedCategoryObj = categories.find((c) => c.category_name === formData.category);

  const handleChange = (field: keyof SubmitComplaintDTO, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Client-side Validation
    const validation = validateComplaintForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toastError('Please fill in all required fields accurately.');
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiService.submitComplaint(formData);
      if (response.success && response.data) {
        navigate('/complaint/success', {
          state: {
            complaintId: response.data.complaint_id,
            complaint: response.data.complaint,
          },
          replace: true,
        });
      } else {
        toastError(
          response.message || 'Something went wrong while submitting your complaint. Please try again.'
        );
      }
    } catch {
      toastError(
        'Unable to connect to the complaint recording server. Please check your connection.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Form Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-3">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span>Student Complaint Portal</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Submit Campus Complaint
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Please fill out the form below with specific details. Your issue will be routed directly to the Chief Proctor.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Classification & Location */}
        <Card>
          <CardHeader
            title={
              <div className="flex items-center gap-2 text-slate-900">
                <FolderTree className="w-5 h-5 text-brand-600" />
                <span>1. Complaint Classification</span>
              </div>
            }
            subtitle="Categorize the type and location of the issue"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Dropdown */}
            <div>
              <Select
                label="Complaint Category"
                requiredIndicator
                placeholder={loadingCategories ? 'Loading categories...' : '— Select Category —'}
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                error={errors.category}
                options={categories
                  .filter((c) => c.status === 'Active')
                  .map((c) => ({
                    value: c.category_name,
                    label: c.category_name,
                  }))}
              />
              {categoryFromUrl && formData.category && (
                <p className="mt-1 text-[11px] text-emerald-600 font-medium">
                  ✓ Category auto-detected from campus QR code.
                </p>
              )}
              {selectedCategoryObj?.description && !categoryFromUrl && (
                <p className="mt-1 text-[11px] text-slate-500 italic">
                  Examples: {selectedCategoryObj.description}
                </p>
              )}
            </div>

            {/* Location Dropdown */}
            <div>
              <Select
                label="Campus Location"
                requiredIndicator
                placeholder={loadingLocations ? 'Loading locations...' : '— Select Location —'}
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                error={errors.location}
                options={locations
                  .filter((l) => l.status === 'Active')
                  .map((l) => ({
                    value: l.location_name,
                    label: l.location_name,
                  }))}
              />
              {locationFromUrl && formData.location && (
                <p className="mt-1 text-[11px] text-emerald-600 font-medium">
                  ✓ Location auto-detected from campus QR code.
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Section 2: Details */}
        <Card>
          <CardHeader
            title={
              <div className="flex items-center gap-2 text-slate-900">
                <FileText className="w-5 h-5 text-brand-600" />
                <span>2. Complaint Description</span>
              </div>
            }
            subtitle="Provide a concise title and detailed explanation"
          />

          <div className="space-y-4">
            <Input
              label="Complaint Title"
              requiredIndicator
              placeholder="e.g. Broken ceiling fan in Room 302 / WiFi down in Lab 2"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              error={errors.title}
              maxLength={FORM_LIMITS.TITLE_MAX_LENGTH}
              helperText={`Keep title short and clear (max ${FORM_LIMITS.TITLE_MAX_LENGTH} chars)`}
            />

            <Textarea
              label="Detailed Description"
              requiredIndicator
              placeholder="Describe what occurred, exact room/floor details, timings, and any recurring patterns..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              error={errors.description}
              maxLength={FORM_LIMITS.DESC_MAX_LENGTH}
              currentLength={formData.description.length}
              showCharCount={true}
              className="min-h-[140px]"
            />
          </div>
        </Card>

        {/* Section 3: Identity & Anonymity Choice */}
        <Card>
          <CardHeader
            title={
              <div className="flex items-center gap-2 text-slate-900">
                <User className="w-5 h-5 text-brand-600" />
                <span>3. Identity & Privacy Preference</span>
              </div>
            }
            subtitle="Decide whether to submit anonymously or provide student credentials"
          />

          {/* Anonymity Checkbox Card */}
          <div className="mb-5">
            <label
              className={`flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                formData.is_anonymous
                  ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/10'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.is_anonymous}
                onChange={(e) => handleChange('is_anonymous', e.target.checked)}
                className="mt-1 w-5 h-5 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <EyeOff className={`w-4 h-4 ${formData.is_anonymous ? 'text-emerald-700' : 'text-slate-600'}`} />
                  <span className={`text-sm font-bold ${formData.is_anonymous ? 'text-emerald-950' : 'text-slate-900'}`}>
                    Submit 100% Anonymously
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  When enabled, your name, student roll number, and phone number will <strong>NOT</strong> be recorded in Google Sheets or backend logs.
                </p>
              </div>
            </label>
          </div>

          {/* Conditional Student Information Form */}
          {formData.is_anonymous ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2.5">
              <Info className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <span>Personal details are hidden and excluded from storage. You will receive a Reference ID upon submission to track the complaint.</span>
            </div>
          ) : (
            <div className="space-y-4 pt-2 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Student Full Name"
                  requiredIndicator
                  placeholder="e.g. Rahul Sharma"
                  value={formData.student_name}
                  onChange={(e) => handleChange('student_name', e.target.value)}
                  error={errors.student_name}
                />

                <Input
                  label="Student ID / Roll No."
                  requiredIndicator
                  placeholder="e.g. 2024-CS-042"
                  value={formData.student_id}
                  onChange={(e) => handleChange('student_id', e.target.value)}
                  error={errors.student_id}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <Select
                    label="Department"
                    requiredIndicator
                    placeholder="— Select Department —"
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    error={errors.department}
                    options={DEPARTMENTS.map((dept) => ({ value: dept, label: dept }))}
                  />
                </div>

                <div>
                  <Select
                    label="Semester"
                    placeholder="— Semester —"
                    value={formData.semester}
                    onChange={(e) => handleChange('semester', e.target.value)}
                    options={SEMESTERS.map((sem) => ({ value: sem, label: sem }))}
                  />
                </div>
              </div>

              <Input
                label="Contact Number (Optional)"
                placeholder="e.g. +91 98765 43210"
                helperText="Provided solely in case the Proctor office needs to coordinate physical access."
                value={formData.contact}
                onChange={(e) => handleChange('contact', e.target.value)}
                error={errors.contact}
              />
            </div>
          )}
        </Card>

        {/* Submit Action */}
        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            variant="primary"
            className="w-full text-base font-bold py-4 shadow-elevated"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            leftIcon={<Send className="w-5 h-5" />}
          >
            {isSubmitting ? 'Recording Complaint...' : 'Submit Complaint to Proctor'}
          </Button>

          <p className="text-center text-xs text-slate-400 mt-3">
            By submitting, you affirm that the information provided is truthful to the best of your knowledge.
          </p>
        </div>
      </form>
    </div>
  );
};
