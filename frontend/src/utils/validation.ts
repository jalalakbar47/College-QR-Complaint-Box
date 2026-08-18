import { FORM_LIMITS } from '../config/constants';
import { SubmitComplaintDTO } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateComplaintForm(dto: Partial<SubmitComplaintDTO>): ValidationResult {
  const errors: Record<string, string> = {};

  // 1. Category validation
  if (!dto.category || dto.category.trim() === '') {
    errors.category = 'Please select a valid complaint category.';
  }

  // 2. Location validation
  if (!dto.location || dto.location.trim() === '') {
    errors.location = 'Please select the location where this issue occurred.';
  }

  // 3. Title validation
  if (!dto.title || dto.title.trim().length < FORM_LIMITS.TITLE_MIN_LENGTH) {
    errors.title = `Title must be at least ${FORM_LIMITS.TITLE_MIN_LENGTH} characters.`;
  } else if (dto.title.trim().length > FORM_LIMITS.TITLE_MAX_LENGTH) {
    errors.title = `Title cannot exceed ${FORM_LIMITS.TITLE_MAX_LENGTH} characters.`;
  }

  // 4. Description validation
  if (!dto.description || dto.description.trim().length < FORM_LIMITS.DESC_MIN_LENGTH) {
    errors.description = `Please provide more details (minimum ${FORM_LIMITS.DESC_MIN_LENGTH} characters).`;
  } else if (dto.description.trim().length > FORM_LIMITS.DESC_MAX_LENGTH) {
    errors.description = `Description cannot exceed ${FORM_LIMITS.DESC_MAX_LENGTH} characters.`;
  }

  // 5. Non-anonymous student validation
  if (!dto.is_anonymous) {
    if (!dto.student_name || dto.student_name.trim().length < 2) {
      errors.student_name = 'Please provide your full name.';
    }
    if (!dto.student_id || dto.student_id.trim().length < 2) {
      errors.student_id = 'Please provide your student ID or roll number.';
    }
    if (!dto.department || dto.department.trim() === '') {
      errors.department = 'Please select your academic department.';
    }
    if (dto.contact && dto.contact.trim().length > 0) {
      const phoneRegex = /^[0-9+()-\s]{7,15}$/;
      if (!phoneRegex.test(dto.contact.trim())) {
        errors.contact = 'Please enter a valid contact number (7-15 digits).';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
