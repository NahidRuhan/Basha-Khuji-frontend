"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/auth-store";
import { getAccessToken, clearTokens } from "../lib/auth";
import api from "../lib/api";
import { User } from "../types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearUser, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get<{ data: User }>("/api/auth/me");
        if (response.data?.data) {
          setUser(response.data.data);
        } else {
          clearTokens();
          clearUser();
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        clearTokens();
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser, clearUser, setLoading]);

  return <>{children}</>;
}
