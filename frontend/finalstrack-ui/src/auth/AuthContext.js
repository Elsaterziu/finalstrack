import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "./authService";
import { tokenStorage } from "./tokenStorage";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const init = async () => {
      const access = tokenStorage.getAccess();

      if (!access) {
        setBooting(false);
        return;
      }

      try {
        const me = await authService.me();
        setUser(me);
      } catch (err) {
        setUser(null);
      } finally {
        setBooting(false);
      }
    };

    init();
  }, []);

  const login = async (email, password) => {
    await authService.login(email, password);
    const me = await authService.me();
    setUser(me);
    return me;
  };

  const register = async (fullName, email, password) => {
    return await authService.register(fullName, email, password);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {}
    tokenStorage.clear();
    setUser(null);
  };

  return (
    <AuthCtx.Provider
      value={{
        user,
        booting,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);