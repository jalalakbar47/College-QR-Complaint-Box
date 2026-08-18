const PREFIX = 'cqb_';

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(PREFIX + key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage set failed:', e);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch (e) {
      console.warn('Storage remove failed:', e);
    }
  },

  clearAll(): void {
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith(PREFIX)) {
          localStorage.removeItem(k);
        }
      });
    } catch (e) {
      console.warn('Storage clear failed:', e);
    }
  },
};
