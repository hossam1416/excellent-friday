"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token and fetch user data on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    api("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const data = await api("/auth/login", {
      method: "POST",
      body: { username, password },
    });

    localStorage.setItem("token", data.token);
    setUser(data.user);
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}
// custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
