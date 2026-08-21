import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AdminNotification } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { apiService } from '../services/api';
import { storage } from '../utils/storage';
import { playNotificationSound, initAudioContext } from '../utils/sound';

interface NotificationContextValue {
  notifications: AdminNotification[];
  unreadCount: number;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  desktopPermission: NotificationPermission;
  requestDesktopPermission: () => Promise<boolean>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  checkNow: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

const STORAGE_KEY_NOTIFS = 'cqb_admin_notifications';
const STORAGE_KEY_KNOWN_IDS = 'cqb_known_complaint_ids';
const STORAGE_KEY_SOUND = 'cqb_sound_enabled';
const POLL_INTERVAL_MS = 12000; // 12 seconds auto-refresh

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const { info } = useToast();

  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    return storage.get<AdminNotification[]>(STORAGE_KEY_NOTIFS, []);
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    return storage.get<boolean>(STORAGE_KEY_SOUND, true);
  });

  const [desktopPermission, setDesktopPermission] = useState<NotificationPermission>(() => {
    return typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default';
  });

  const knownIdsRef = useRef<Set<string>>(new Set(storage.get<string[]>(STORAGE_KEY_KNOWN_IDS, [])));
  const isInitializedRef = useRef<boolean>(false);
  const soundEnabledRef = useRef<boolean>(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    storage.set(STORAGE_KEY_SOUND, enabled);
  }, []);

  const saveNotifications = useCallback((items: AdminNotification[]) => {
    setNotifications(items);
    storage.set(STORAGE_KEY_NOTIFS, items);
  }, []);

  const requestDesktopPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    try {
      const perm = await Notification.requestPermission();
      setDesktopPermission(perm);
      return perm === 'granted';
    } catch {
      return false;
    }
  }, []);

  const triggerDesktopNotification = useCallback((notif: AdminNotification) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const n = new Notification('🚨 New Complaint Ticket', {
          body: `[${notif.category}] ${notif.title}\nLocation: ${notif.location}\nTicket: ${notif.complaint_id}`,
          icon: '/favicon.svg',
          tag: notif.complaint_id,
        });
        n.onclick = () => {
          window.focus();
          window.location.hash = `#/admin/complaints/${notif.complaint_id}`;
        };
      } catch (e) {
        console.warn('Desktop notification error:', e);
      }
    }
  }, []);

  const handleIncomingComplaints = useCallback(
    (newItems: any[], isInitialLoad: boolean) => {
      if (!Array.isArray(newItems) || newItems.length === 0) return;

      const createdNotifs: AdminNotification[] = [];

      for (const item of newItems) {
        if (!item || !item.complaint_id) continue;

        if (!knownIdsRef.current.has(item.complaint_id)) {
          knownIdsRef.current.add(item.complaint_id);

          // On initial mount, just populate known IDs without spamming alerts for past history
          if (!isInitialLoad) {
            const notif: AdminNotification = {
              id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              complaint_id: item.complaint_id,
              title: item.title || 'New Complaint',
              category: item.category || 'General',
              priority: item.priority || 'Medium',
              location: item.location || 'Campus',
              submitted_at: item.submitted_at || new Date().toISOString(),
              is_anonymous: !!item.is_anonymous,
              student_name: item.student_name,
              timestamp: Date.now(),
              is_read: false,
            };
            createdNotifs.push(notif);
          }
        }
      }

      // Persist updated known IDs
      storage.set(STORAGE_KEY_KNOWN_IDS, Array.from(knownIdsRef.current));

      if (createdNotifs.length > 0) {
        // Play audio chime if enabled
        if (soundEnabledRef.current) {
          playNotificationSound();
        }

        // Show interactive in-app toast & desktop alerts
        for (const notif of createdNotifs) {
          info(
            `[${notif.priority.toUpperCase()}] ${notif.category} at ${notif.location} • Ticket #${notif.complaint_id}`,
            '🚨 New Complaint Logged'
          );
          triggerDesktopNotification(notif);
        }

        // Update notifications state
        setNotifications((prev) => {
          const updated = [...createdNotifs, ...prev].slice(0, 50); // Keep latest 50
          storage.set(STORAGE_KEY_NOTIFS, updated);
          return updated;
        });
      }
    },
    [info, triggerDesktopNotification]
  );

  const checkNow = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await apiService.getComplaints({ token: token || undefined });
      if (res.success && Array.isArray(res.data)) {
        handleIncomingComplaints(res.data, !isInitializedRef.current);
        isInitializedRef.current = true;
      }
    } catch (err) {
      console.warn('Notification poll error:', err);
    }
  }, [isAuthenticated, token, handleIncomingComplaints]);

  // Audio Context unlock on initial user interaction
  useEffect(() => {
    const unlockAudio = () => {
      initAudioContext();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  // Real-time Event Listeners (BroadcastChannel, CustomEvent, Storage)
  useEffect(() => {
    if (!isAuthenticated) return;

    // 1. Cross-tab BroadcastChannel listener
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('cqb_notifications_channel');
        bc.onmessage = (event) => {
          if (event.data?.action === 'NEW_COMPLAINT' && event.data?.payload) {
            handleIncomingComplaints([event.data.payload], false);
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }

    // 2. Custom window event listener (in-tab submissions)
    const handleCustomEvent = (e: any) => {
      if (e.detail) {
        handleIncomingComplaints([e.detail], false);
      }
    };
    window.addEventListener('cqb_complaint_logged', handleCustomEvent);

    // 3. Storage event fallback for cross-tab local storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cqb_last_submitted_ping' || e.key === 'complaints_db') {
        checkNow();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 4. Tab visibility change - recheck immediately when user switches to tab
    const handleVisibility = () => {
      if (!document.hidden) {
        checkNow();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('cqb_complaint_logged', handleCustomEvent);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isAuthenticated, handleIncomingComplaints, checkNow]);

  // Periodic Polling
  useEffect(() => {
    if (!isAuthenticated) {
      isInitializedRef.current = false;
      return;
    }

    // Initial check immediately on admin login / mount
    checkNow();

    const interval = setInterval(() => {
      checkNow();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isAuthenticated, checkNow]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, is_read: true } : n));
      storage.set(STORAGE_KEY_NOTIFS, updated);
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, is_read: true }));
      storage.set(STORAGE_KEY_NOTIFS, updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    saveNotifications([]);
  }, [saveNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        soundEnabled,
        setSoundEnabled,
        desktopPermission,
        requestDesktopPermission,
        markAsRead,
        markAllAsRead,
        clearAll,
        checkNow,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
