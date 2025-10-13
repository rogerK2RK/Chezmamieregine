import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const ClientAuthContext = createContext(null);

export function ClientAuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('clientToken') || null);
  const [role, setRole]   = useState(localStorage.getItem('clientRole') || 'client');
  const [name, setName]   = useState(localStorage.getItem('clientName') || '');

  // à chaque chargement, on pousse le token actuel sur axios (utile si F5)
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  const login = ({ token, role = 'client', name = '' }) => {
    localStorage.setItem('clientToken', token);
    localStorage.setItem('clientRole', role);
    localStorage.setItem('clientName', name);
    setToken(token);
    setRole(role);
    setName(name);
    // Axios utilisera aussi l'intercepteur, mais on met à jour tout de suite:
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientRole');
    localStorage.removeItem('clientName');
    setToken(null);
    setRole('client');
    setName('');
    delete api.defaults.headers.common.Authorization;
  };

  return (
    <ClientAuthContext.Provider value={{ token, role, name, login, logout }}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const ctx = useContext(ClientAuthContext);
  if (!ctx) throw new Error('useClientAuth must be used within <ClientAuthProvider>');
  return ctx;
}
