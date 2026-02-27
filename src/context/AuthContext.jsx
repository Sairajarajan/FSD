import { createContext, useEffect, useState } from "react";
import { loginAdmin } from "../services/api";
import { ADMIN_STORAGE_KEY } from "../utils/constants";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError("");
      const admin = await loginAdmin(email, password);
      setUser(admin);
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));
      return admin;
    } catch (err) {
      const message = err.message || "Login failed";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, isAuthenticated: Boolean(user), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
