import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from './ToastContext';

interface RefreshContextValue {
  refreshKey: number;
  isRefreshing: boolean;
  lastRefreshed: Date | null;
  refreshAll: (silent?: boolean) => Promise<void>;
  registerRefreshHandler: (id: string, handler: () => Promise<void> | void) => () => void;
}

const RefreshContext = createContext<RefreshContextValue | undefined>(undefined);

export const RefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(() => new Date());
  const { success } = useToast();

  const handlersRef = useRef<Map<string, () => Promise<void> | void>>(new Map());

  const registerRefreshHandler = useCallback((id: string, handler: () => Promise<void> | void) => {
    handlersRef.current.set(id, handler);
    return () => {
      handlersRef.current.delete(id);
    };
  }, []);

  const refreshAll = useCallback(
    async (silent: boolean = true) => {
      if (isRefreshing) return;
      setIsRefreshing(true);

      try {
        const promises: Promise<void>[] = [];
        handlersRef.current.forEach((handler) => {
          try {
            const res = handler();
            if (res instanceof Promise) {
              promises.push(res);
            }
          } catch (e) {
            console.warn('Refresh handler error:', e);
          }
        });

        await Promise.allSettled(promises);
        setRefreshKey((prev) => prev + 1);
        setLastRefreshed(new Date());

        if (!silent) {
          success('Database records synchronized successfully.');
        }
      } finally {
        setIsRefreshing(false);
      }
    },
    [isRefreshing, success]
  );

  // Cross-tab and explicit mutation listener (NO aggressive auto-intervals or focus reloads)
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('cqb_mutations_channel');
        bc.onmessage = () => {
          refreshAll(true);
        };
      }
    } catch {}

    const handleDataChanged = () => {
      refreshAll(true);
    };
    window.addEventListener('cqb_data_changed', handleDataChanged);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('cqb_data_changed', handleDataChanged);
    };
  }, [refreshAll]);

  // Optional background keyboard shortcut (Alt + R)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        refreshAll(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [refreshAll]);

  return (
    <RefreshContext.Provider
      value={{
        refreshKey,
        isRefreshing,
        lastRefreshed,
        refreshAll,
        registerRefreshHandler,
      }}
    >
      {children}
    </RefreshContext.Provider>
  );
};

export function useRefresh(): RefreshContextValue {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error('useRefresh must be used within a RefreshProvider');
  }
  return context;
}
