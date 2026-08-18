import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Admin, AuthSession } from '../types';
import { apiService } from '../services/api';
import { storage } from '../utils/storage';

interface AuthContextValue {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, passkey: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'admin_session';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session on initial load
  useEffect(() => {
    try {
      const session = storage.get<AuthSession | null>(AUTH_STORAGE_KEY, null);
      if (session && session.token && session.admin) {
        // If live API is configured but session has an old mock token, clear it
        if (session.token.startsWith('GAS_SESSION_')) {
          storage.remove(AUTH_STORAGE_KEY);
          setAdmin(null);
          setToken(null);
          return;
        }

        // Check session expiry (e.g. 12 hours)
        if (session.expiresAt > Date.now()) {
          setAdmin(session.admin);
          setToken(session.token);
        } else {
          storage.remove(AUTH_STORAGE_KEY);
        }
      }
    } catch {
      storage.remove(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, passkey: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.adminLogin(email, passkey);
      if (response.success && response.data) {
        const { token: sessionToken, admin: adminData } = response.data;
        const session: AuthSession = {
          token: sessionToken,
          admin: adminData,
          expiresAt: Date.now() + 12 * 60 * 60 * 1000, // 12 hours
        };

        storage.set(AUTH_STORAGE_KEY, session);
        setAdmin(adminData);
        setToken(sessionToken);

        return { success: true, message: response.message || 'Login successful' };
      } else {
        return { success: false, message: response.message || 'Authentication failed' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'An unexpected error occurred.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    storage.remove(AUTH_STORAGE_KEY);
    setAdmin(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: Boolean(admin && token),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
