import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { whatsappLink } from '../config/contact.js';

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);

const load = () => {
  try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);
  const [open, setOpen] = useState(false);

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(items)); }, [items]);

  const addItem = useCallback((plat, qty = 1) => {
    const id = plat._id || plat.id;
    if (!id) return;
    setItems((cur) => {
      const i = cur.findIndex((x) => x.id === id);
      if (i >= 0) {
        const c = [...cur];
        c[i] = { ...c[i], qty: c[i].qty + qty };
        return c;
      }
      return [...cur, {
        id,
        name: plat.name,
        nameAccent: plat.nameAccent || '',
        price: Number(plat.price) || 0,
        image: plat.images?.[0] || '',
        qty,
      }];
    });
  }, []);

  const setQty = useCallback((id, qty) => {
    setItems((cur) => (qty <= 0 ? cur.filter((x) => x.id !== id) : cur.map((x) => (x.id === id ? { ...x, qty } : x))));
  }, []);

  const removeItem = useCallback((id) => setItems((cur) => cur.filter((x) => x.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((n, x) => n + x.qty, 0), [items]);
  const total = useMemo(() => items.reduce((n, x) => n + x.price * x.qty, 0), [items]);

  const checkoutLink = useMemo(() => {
    if (!items.length) return whatsappLink('Bonjour Chez Mamie Régine 👋, je souhaite passer une commande.');
    const lines = items.map(
      (x) => `• ${x.qty}× ${x.name}${x.nameAccent ? ` ${x.nameAccent}` : ''} — ${(x.price * x.qty).toFixed(0)} €`
    );
    const msg = `Bonjour Chez Mamie Régine 👋, je souhaite commander :\n${lines.join('\n')}\nTotal : ${total.toFixed(0)} €`;
    return whatsappLink(msg);
  }, [items, total]);

  const value = { items, addItem, setQty, removeItem, clear, count, total, open, setOpen, checkoutLink };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
