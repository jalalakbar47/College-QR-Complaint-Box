import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import {
  modalScaleVariants,
  fadeInVariants,
  usePrefersReducedMotion,
  getMotionVariant,
} from '../../lib/motion';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
  showCloseButton = true,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const scaleVariants = getMotionVariant(modalScaleVariants, prefersReducedMotion);
  const backdropVariants = getMotionVariant(fadeInVariants, prefersReducedMotion);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop (300ms in, 200ms out) */}
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={backdropVariants}
            className="fixed inset-0 bg-ink-navy/60 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Dialog Window (0.96 -> 1.0, 300ms in, 200ms out) */}
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={scaleVariants}
            className={`relative flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] rounded-2xl bg-paper-card text-left shadow-lg border border-hairline w-full my-auto ${maxWidthClasses[maxWidth]} z-10 overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-5 py-4 border-b border-hairline bg-paper-card flex-shrink-0">
                <div className="min-w-0 pr-2">
                  {title && (
                    <h3 className="text-base sm:text-lg font-semibold text-ink-navy tracking-tight truncate">
                      {title}
                    </h3>
                  )}
                  {subtitle && <p className="text-xs text-ink-muted mt-0.5 truncate">{subtitle}</p>}
                </div>
                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-1.5 text-ink-muted hover:bg-paper hover:text-ink-navy transition-colors flex-shrink-0"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
