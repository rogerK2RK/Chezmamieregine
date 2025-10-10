import { useEffect, useState } from 'react';
import apiAdmin from '../../../services/apiAdmin';

// AdminCommandes.jsx
export default function AdminCommandes() {
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    const fetchCommandes = async () => {
      const token = localStorage.getItem('token');
      const res = await apiAdmin.get('/commandes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommandes(res.data);
    };
    fetchCommandes();
  }, []);

  return (
    <div>
      <h2>Gestion des Commandes</h2>
      <ul>
        {commandes.map((commande) => (
          <li key={commande._id}>Commande de {commande.user.name}</li>
        ))}
      </ul>
    </div>
  );
}
