import { useState, useEffect } from "react";
import { authApi, postsApi } from "../api/client";

export interface User {
  id: string;
  name: string;
  email: string;
  postsCount: number;
  hasProfile: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  // hydrate user if access token exists
  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) return;

    postsApi
      .dashboard()
      .then((res) => {
        const data = res.data;
        const hydrated: User = {
          id: "backend",
          name: data.username,
          email: "",
          postsCount: data.user_posts_count,
          hasProfile: data.has_profile,
        };
        setUser(hydrated);
      })
      .catch(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
      });
  }, []);

  // registration with field-level errors
  const register = async (
    username: string,
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<{
    success: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
  }> => {
    console.log("DEBUG passwords:", password, confirmPassword);

    try {
      await authApi.register(username, name, email, password, confirmPassword);
      return { success: true };
    } catch (err: any) {
      const data = (err.response?.data || {}) as Record<string, string[]>;
      const msg =
        data.password?.[0] ||
        data.confirmPassword?.[0] ||
        data.username?.[0] ||
        data.email?.[0] ||
        "Registration failed";
      return { success: false, error: msg, fieldErrors: data };
    }
  };

  // login with username
  const login = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authApi.login(username, password);
      const { access, refresh } = res.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      const dashRes = await postsApi.dashboard();
      const data = dashRes.data;

      const loggedIn: User = {
        id: "backend",
        name: data.username,
        email: "",
        postsCount: data.user_posts_count,
        hasProfile: data.has_profile,
      };
      setUser(loggedIn);

      return { success: true };
    } catch {
      return { success: false, error: "Invalid username or password" };
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  return { user, login, logout, register, updateUser };
}
