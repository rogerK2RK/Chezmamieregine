import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminPlats() {
  const [plats, setPlats] = useState([]);

  useEffect(() => {
    const fetchPlats = async () => {
      const token = localStorage.getItem('token');
      const res = await api.get('/plats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlats(res.data);
    };
    fetchPlats();
  }, []);

  return (
    <div>
      <h2>Gestion des Plats</h2>
      <ul>
        {plats.map((plat) => (
          <li key={plat._id}>{plat.nom}</li>
        ))}
      </ul>
    </div>
  );
}
