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

const BG_SYNC_INTERVAL_MS = 15000; // 15 seconds automatic background sync

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
        // Trigger all registered hook/page handlers in parallel
        const promises: Promise<void>[] = [];
        handlersRef.current.forEach((handler) => {
          try {
            const res = handler();
            if (res instanceof Promise) {
              promises.push(res);
            }
          } catch (e) {
            console.warn('Background sync handler error:', e);
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

  // Background Change Detection & Auto-Sync Engine
  useEffect(() => {
    // 1. Cross-tab mutation channel
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('cqb_mutations_channel');
        bc.onmessage = () => {
          refreshAll(true);
        };
      }
    } catch {}

    // 2. Custom DOM events dispatched when data changes in any component
    const handleDataChanged = () => {
      refreshAll(true);
    };
    window.addEventListener('cqb_data_changed', handleDataChanged);
    window.addEventListener('cqb_complaint_logged', handleDataChanged);

    // 3. Storage event fallback for cross-tab mutations
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === 'complaints_db' ||
        e.key === 'categories_db' ||
        e.key === 'locations_db' ||
        e.key === 'logs_db' ||
        e.key === 'cqb_data_mutation_ping'
      ) {
        refreshAll(true);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 4. Tab visibility / window focus (sync immediately when admin switches to tab)
    const handleVisibility = () => {
      if (!document.hidden) {
        refreshAll(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    // 5. Periodic background sync loop (every 15 seconds)
    const interval = setInterval(() => {
      refreshAll(true);
    }, BG_SYNC_INTERVAL_MS);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('cqb_data_changed', handleDataChanged);
      window.removeEventListener('cqb_complaint_logged', handleDataChanged);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
      clearInterval(interval);
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
