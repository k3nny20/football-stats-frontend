import React, { createContext, useState, useEffect } from 'react';

// Create context
export const AuthContext = createContext();

// Auth provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user = null means not logged in

  // Optionally check localStorage for persisted user
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
