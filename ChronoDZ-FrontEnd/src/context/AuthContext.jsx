import { createContext, useContext, useEffect, useState } from "react";
import { authApi, usersApi, sessionApi } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(sessionApi.getUser());
  const [authMode, setAuthMode] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!sessionApi.getToken()) return;
      try {
        const data = await authApi.me();
        setSession(data.user);
        sessionApi.saveSession({ token: sessionApi.getToken(), user: data.user });
      } catch {
        sessionApi.clearSession();
        setSession(null);
      }
    };
    init();
  }, []);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    setSession(data.user);
    setAuthMode(null);
    return data;
  };

  const register = async (userData) => {
    const data = await authApi.register(userData);
    setSession(data.user);
    setAuthMode(null);
    return data;
  };

  const logout = () => {
    authApi.logout();
    setSession(null);
  };

  const updateProfile = async (payload) => {
    if (!session?.id) throw new Error("Utilisateur introuvable");
    const updated = await usersApi.updateMe(session.id, payload);
    const updatedUser = updated.user || updated;
    setSession(updatedUser);
    sessionApi.saveSession({
      token: sessionApi.getToken(),
      user: updatedUser,
    });
    return updatedUser;
  };

  const openAuth = (mode = "login") => setAuthMode(mode);
  const closeAuth = () => setAuthMode(null);

  return (
    <AuthContext.Provider
      value={{
        session,
        authMode,
        openAuth,
        closeAuth,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}