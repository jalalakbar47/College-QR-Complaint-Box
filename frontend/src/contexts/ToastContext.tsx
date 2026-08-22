import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { usePrefersReducedMotion, MOTION_EASINGS } from '../lib/motion';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((message: string, title?: string) => showToast({ type: 'success', title, message }), [showToast]);
  const error = useCallback((message: string, title?: string) => showToast({ type: 'error', title, message }), [showToast]);
  const info = useCallback((message: string, title?: string) => showToast({ type: 'info', title, message }), [showToast]);
  const warning = useCallback((message: string, title?: string) => showToast({ type: 'warning', title, message }), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      {/* Floating Toast Container */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-md w-full px-4 pointer-events-none"
      >
        <AnimatePresence mode="sync">
          {toasts.map((t) => {
            const icons = {
              success: <CheckCircle2 className="w-5 h-5 text-ledger-green flex-shrink-0" />,
              error: <AlertCircle className="w-5 h-5 text-case-red flex-shrink-0" />,
              warning: <AlertTriangle className="w-5 h-5 text-seal-gold flex-shrink-0" />,
              info: <Info className="w-5 h-5 text-registrar-blue flex-shrink-0" />,
            };

            const progressColors = {
              success: 'bg-ledger-green',
              error: 'bg-case-red',
              warning: 'bg-seal-gold',
              info: 'bg-registrar-blue',
            };

            return (
              <motion.div
                key={t.id}
                initial={{
                  opacity: 0,
                  y: prefersReducedMotion ? 0 : 16,
                  scale: prefersReducedMotion ? 1 : 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: 0.25,
                    ease: MOTION_EASINGS.easeOutQuart,
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: prefersReducedMotion ? 1 : 0.96,
                  transition: {
                    duration: 0.15,
                    ease: MOTION_EASINGS.standardEase,
                  },
                }}
                className="pointer-events-auto relative overflow-hidden flex flex-col rounded-2xl border border-hairline bg-paper-card shadow-lg"
                role="alert"
              >
                <div className="flex items-start gap-3 p-4">
                  {icons[t.type]}
                  <div className="flex-1 text-xs sm:text-sm">
                    {t.title && <p className="font-semibold text-ink-navy mb-0.5">{t.title}</p>}
                    <p className="text-ink-muted leading-snug font-sans">{t.message}</p>
                  </div>
                  <button
                    onClick={() => removeToast(t.id)}
                    className="text-ink-muted hover:text-ink-navy p-1 rounded-lg transition-colors flex-shrink-0"
                    aria-label="Close notification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress-bar Underline showing countdown to auto-dismiss */}
                {t.duration && t.duration > 0 && !prefersReducedMotion && (
                  <div className="h-0.5 w-full bg-paper-recessed overflow-hidden">
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{
                        duration: t.duration / 1000,
                        ease: 'linear',
                      }}
                      className={`h-full ${progressColors[t.type]}`}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
