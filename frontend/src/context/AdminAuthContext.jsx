import { createContext, useContext, useState } from 'react';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [role, setRole] = useState(localStorage.getItem('adminRole') || '');
  const [name, setName] = useState(localStorage.getItem('adminName') || '');

  const login = ({ token, role, name }) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminRole', role);
    localStorage.setItem('adminName', name || '');
    setToken(token);
    setRole(role);
    setName(name || '');
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminName');
    setToken(null);
    setRole('');
    setName('');
  };

  return (
    <AdminAuthContext.Provider value={{ token, role, name, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
