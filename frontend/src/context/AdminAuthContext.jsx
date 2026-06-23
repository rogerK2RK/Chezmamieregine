import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext(null);
export const useAdminAuth = () => useContext(Ctx);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || '');
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adminUser') || 'null'); } catch { return null; }
  });

  useEffect(() => {
    if (token) localStorage.setItem('adminToken', token); else localStorage.removeItem('adminToken');
  }, [token]);
  useEffect(() => {
    if (admin) localStorage.setItem('adminUser', JSON.stringify(admin)); else localStorage.removeItem('adminUser');
  }, [admin]);

  const login = ({ token, ...a }) => { setToken(token || ''); setAdmin(a || null); };
  const logout = () => { setToken(''); setAdmin(null); };

  return <Ctx.Provider value={{ token, admin, login, logout }}>{children}</Ctx.Provider>;
}
