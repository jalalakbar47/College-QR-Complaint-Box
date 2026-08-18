import React, { forwardRef } from 'react';

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

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              {label}
              {requiredIndicator && <span className="text-rose-500 ml-1 font-bold">*</span>}
            </label>
          )}
          {showCharCount && maxLength && (
            <span className={`text-xs ${count > maxLength * 0.9 ? 'text-amber-600 font-medium' : 'text-slate-400'}`}>
              {count} / {maxLength}
            </span>
          )}
        </div>
        <div className="relative rounded-xl shadow-subtle">
          <textarea
            id={inputId}
            ref={ref}
            maxLength={maxLength}
            value={value}
            className={`block w-full rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 text-sm p-3.5 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed resize-y min-h-[120px] ${
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900 bg-rose-50/20'
                : 'border-slate-300 hover:border-slate-400 focus:border-brand-500 focus:ring-brand-500/20'
            } ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
