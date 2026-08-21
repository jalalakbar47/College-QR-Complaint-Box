import React from 'react';

export interface SectionEyebrowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  rulePosition?: 'left' | 'right' | 'both';
}

export const SectionEyebrow: React.FC<SectionEyebrowProps> = ({
  children,
  rulePosition = 'left',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-seal-gold font-medium select-none ${className}`}
      {...props}
    >
      {(rulePosition === 'left' || rulePosition === 'both') && (
        <span className="w-4 h-[1px] bg-seal-gold/70 inline-block flex-shrink-0" aria-hidden="true" />
      )}
      <span>{children}</span>
      {(rulePosition === 'right' || rulePosition === 'both') && (
        <span className="w-4 h-[1px] bg-seal-gold/70 inline-block flex-shrink-0" aria-hidden="true" />
      )}
    </div>
  );
};
