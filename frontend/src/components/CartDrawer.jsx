import { TEL_LINK, PHONE_DISPLAY } from '../config/contact.js';
import { useCart } from '../context/CartContext.jsx';

export default function CartDrawer() {
  const { items, setQty, removeItem, clear, total, count, open, setOpen, checkoutLink } = useCart();

  return (
    <>
      {count > 0 && !open && (
        <button className="cart-fab" onClick={() => setOpen(true)} aria-label="Voir le panier">
          <span className="material-symbols-outlined" aria-hidden="true">shopping_cart</span>
          <span className="cart-fab-count">{count}</span>
        </button>
      )}
      <div className={`cart-backdrop ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`cart-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="cart-head">
          <h3>Mon panier</h3>
          <button className="cart-close" onClick={() => setOpen(false)} aria-label="Fermer">×</button>
        </div>

        {items.length === 0 ? (
          <p className="cart-empty">Votre panier est vide.<br />Ajoutez des plats pour commander.</p>
        ) : (
          <>
            <div className="cart-items">
              {items.map((x) => (
                <div className="cart-item" key={x.id}>
                  <div className="cart-item-media">{x.image ? <img src={x.image} alt={x.name} /> : null}</div>
                  <div className="cart-item-info">
                    <span className="cart-item-name">{x.name}{x.nameAccent ? ` ${x.nameAccent}` : ''}</span>
                    <span className="cart-item-unit">{x.price.toFixed(0)} € / unité</span>
                    <div className="cart-qty">
                      <button onClick={() => setQty(x.id, x.qty - 1)} aria-label="Diminuer">−</button>
                      <span>{x.qty}</span>
                      <button onClick={() => setQty(x.id, x.qty + 1)} aria-label="Augmenter">+</button>
                      <button className="cart-remove" onClick={() => removeItem(x.id)}>Retirer</button>
                    </div>
                  </div>
                  <span className="cart-item-price">{(x.price * x.qty).toFixed(0)} €</span>
                </div>
              ))}
            </div>

            <div className="cart-foot">
              <div className="cart-total"><span>Total</span><strong>{total.toFixed(0)} €</strong></div>
              <a className="btn-primary cart-checkout" href={checkoutLink} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                Commander sur WhatsApp
              </a>
              <a className="cart-tel" href={TEL_LINK}>ou par téléphone · {PHONE_DISPLAY}</a>
              <button className="cart-clear" onClick={clear}>Vider le panier</button>
              <p className="cart-note">Aucun paiement en ligne. La commande est confirmée par WhatsApp ou téléphone.</p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
