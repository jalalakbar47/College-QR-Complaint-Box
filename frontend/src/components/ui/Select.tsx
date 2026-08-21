import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  placeholder?: string;
  requiredIndicator?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder,
      requiredIndicator,
      className = '',
      id,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-medium uppercase tracking-wider text-ink-navy mb-1.5 font-mono">
            {label}
            {requiredIndicator && <span className="text-case-red ml-1 font-bold">*</span>}
          </label>
        )}
        <div className="relative rounded-lg shadow-subtle">
          <select
            id={selectId}
            ref={ref}
            className={`block w-full appearance-none rounded-lg border bg-paper-card text-ink-navy text-sm px-3.5 py-2.5 pr-10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-registrar-blue focus:border-registrar-blue disabled:bg-paper disabled:text-ink-muted disabled:cursor-not-allowed cursor-pointer min-h-[44px] ${error
                ? 'border-case-red/50 focus:border-case-red focus:ring-case-red/20 text-case-red bg-case-red/5'
                : 'border-hairline hover:border-ink-muted/40'
              } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-ink-muted">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-case-red font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-ink-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
