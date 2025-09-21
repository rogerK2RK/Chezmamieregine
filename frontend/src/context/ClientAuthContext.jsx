import { createContext, useContext, useState } from 'react';

const ClientAuthContext = createContext(null);

export function ClientAuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('clientToken') || null);
  const [role, setRole]   = useState(localStorage.getItem('clientRole') || 'client');
  const [name, setName]   = useState(localStorage.getItem('clientName') || '');

  const login = ({ token, role = 'client', name = '' }) => {
    localStorage.setItem('clientToken', token);
    localStorage.setItem('clientRole', role);
    localStorage.setItem('clientName', name);
    setToken(token); setRole(role); setName(name);
  };

  const logout = () => {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientRole');
    localStorage.removeItem('clientName');
    setToken(null); setRole('client'); setName('');
  };

  return (
    <ClientAuthContext.Provider value={{ token, role, name, login, logout }}>
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const ctx = useContext(ClientAuthContext);
  if (!ctx) {
    // Garde utile pour des erreurs plus claires pendant le dev
    throw new Error('useClientAuth must be used within <ClientAuthProvider>');
  }
  return ctx;
}
