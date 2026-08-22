import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { usePrefersReducedMotion, inputErrorShakeTransition, inputShakeKeyframes } from '../../lib/motion';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  requiredIndicator?: boolean;
  showValidCheck?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      requiredIndicator,
      showValidCheck = false,
      className = '',
      id,
      value,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const prefersReducedMotion = usePrefersReducedMotion();
    const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
    const isValid = showValidCheck && hasValue && !error;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium uppercase tracking-wider text-ink-navy mb-1.5 font-mono">
            {label}
            {requiredIndicator && <span className="text-case-red ml-1 font-bold">*</span>}
          </label>
        )}

        <motion.div
          animate={error && !prefersReducedMotion ? { x: inputShakeKeyframes } : { x: 0 }}
          transition={inputErrorShakeTransition}
          className="relative rounded-lg shadow-subtle"
        >
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            value={value}
            className={`block w-full rounded-lg border bg-paper-recessed text-ink-navy placeholder:text-ink-muted text-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-registrar-blue focus:border-registrar-blue focus:bg-white disabled:bg-paper disabled:text-ink-muted disabled:cursor-not-allowed min-h-[44px] ${
              leftIcon ? 'pl-10' : 'pl-3.5'
            } ${rightIcon || isValid ? 'pr-10' : 'pr-3.5'} py-2.5 ${
              error
                ? 'border-case-red/60 focus:border-case-red focus:ring-case-red/20 text-case-red bg-case-red/5'
                : 'border-hairline hover:border-ink-muted/40'
            } ${className}`}
            {...props}
          />

          {isValid && !rightIcon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ledger-green pointer-events-none"
            >
              <Check className="w-4 h-4" />
            </motion.div>
          )}

          {rightIcon && !isValid && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink-muted">
              {rightIcon}
            </div>
          )}
        </motion.div>

        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="mt-1.5 text-xs text-case-red font-medium flex items-center gap-1"
          >
            <span>{error}</span>
          </motion.p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-ink-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
