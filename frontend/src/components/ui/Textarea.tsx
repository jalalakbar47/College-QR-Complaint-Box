import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion, inputErrorShakeTransition, inputShakeKeyframes } from '../../lib/motion';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  currentLength?: number;
  showCharCount?: boolean;
  requiredIndicator?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      maxLength,
      currentLength,
      showCharCount = false,
      requiredIndicator,
      className = '',
      id,
      value,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const count = currentLength !== undefined ? currentLength : typeof value === 'string' ? value.length : 0;
    const prefersReducedMotion = usePrefersReducedMotion();

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <label htmlFor={inputId} className="block text-xs font-medium uppercase tracking-wider text-ink-navy font-mono">
              {label}
              {requiredIndicator && <span className="text-case-red ml-1 font-bold">*</span>}
            </label>
          )}
          {showCharCount && maxLength && (
            <span className={`text-xs font-mono ${count > maxLength * 0.9 ? 'text-case-red font-medium' : 'text-ink-muted'}`}>
              {count} / {maxLength}
            </span>
          )}
        </div>

        <motion.div
          animate={error && !prefersReducedMotion ? { x: inputShakeKeyframes } : { x: 0 }}
          transition={inputErrorShakeTransition}
          className="relative rounded-lg shadow-subtle"
        >
          <textarea
            id={inputId}
            ref={ref}
            maxLength={maxLength}
            value={value}
            className={`block w-full rounded-lg border bg-paper-recessed text-ink-navy placeholder:text-ink-muted text-sm p-3.5 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-registrar-blue focus:border-registrar-blue focus:bg-white disabled:bg-paper disabled:text-ink-muted disabled:cursor-not-allowed resize-y min-h-[120px] ${
              error
                ? 'border-case-red/60 focus:border-case-red focus:ring-case-red/20 text-case-red bg-case-red/5'
                : 'border-hairline hover:border-ink-muted/40'
            } ${className}`}
            {...props}
          />
        </motion.div>

        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="mt-1.5 text-xs text-case-red font-medium"
          >
            {error}
          </motion.p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-ink-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
