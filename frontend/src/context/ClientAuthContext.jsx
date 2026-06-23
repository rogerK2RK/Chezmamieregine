import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext(null);
export const useClientAuth = () => useContext(Ctx);

export function ClientAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('clientToken') || '');
  const [name, setName] = useState(() => localStorage.getItem('clientName') || '');

  useEffect(() => {
    if (token) localStorage.setItem('clientToken', token); else localStorage.removeItem('clientToken');
  }, [token]);
  useEffect(() => {
    if (name) localStorage.setItem('clientName', name); else localStorage.removeItem('clientName');
  }, [name]);

  const login = ({ token, name }) => { setToken(token || ''); setName(name || ''); };
  const logout = () => { setToken(''); setName(''); };

  return <Ctx.Provider value={{ token, name, login, logout }}>{children}</Ctx.Provider>;
}
