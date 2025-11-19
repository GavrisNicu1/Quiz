import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";

import type { User } from "../types";
import {
  fetchProfile,
  loginRequest,
  logoutRequest,
  registerRequest,
} from "../api/auth";
import { getStoredToken, setAuthToken } from "../api/http";

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const formatError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "A apărut o eroare";
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const token = getStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const { user: profile } = await fetchProfile();
      setUser(profile);
    } catch (error) {
      console.error("Profil indisponibil", error);
      setAuthToken(undefined);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    try {
      const { user: loggedUser } = await loginRequest(credentials);
      setUser(loggedUser);
    } catch (error) {
      throw new Error(formatError(error));
    }
  }, []);

  const register = useCallback(
    async (payload: { name: string; email: string; password: string }) => {
      try {
        const { user: createdUser } = await registerRequest(payload);
        setUser(createdUser);
      } catch (error) {
        throw new Error(formatError(error));
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const { user: profile } = await fetchProfile();
      setUser(profile);
    } catch (error) {
      throw new Error(formatError(error));
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, register, refreshProfile }),
    [user, loading, login, logout, register, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
