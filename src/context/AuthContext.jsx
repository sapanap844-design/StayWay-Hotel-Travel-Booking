import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

/** Keeps the logged-in user in one place so every page can read it. */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';

  return <AuthContext.Provider value={{ user, login, logout, isAdmin }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
