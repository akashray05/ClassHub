import { createContext, useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";

import type { UserResponse } from "@/types/auth";
import { login as loginRequest, logout as logoutRequest } from "@/services/auth";
import { getCurrentUser } from "@/services/user";
import {
  clearTokens,
  getAccessToken,
  getStoredUser,
  setStoredUser,
  setTokens,
} from "@/store/auth";

export interface AuthContextValue {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserResponse | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      return;
    }

    try {
      const currentUser = await getCurrentUser();

      setUser(currentUser);
      setStoredUser(currentUser);
    } catch {
      clearTokens();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      if (getAccessToken()) {
        await refreshUser();
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginRequest(email, password);

      setTokens(result.access_token, result.refresh_token);

      await refreshUser();
    },
    [refreshUser]
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // Token may already be invalid; clear local state regardless.
    } finally {
      clearTokens();
      setUser(null);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
