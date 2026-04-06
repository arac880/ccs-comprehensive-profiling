import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Persist user on page refresh
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || null;
  });

  const login = (userData, userRole) => {
    setUser(userData);
    setRole(userRole);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userRole);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
