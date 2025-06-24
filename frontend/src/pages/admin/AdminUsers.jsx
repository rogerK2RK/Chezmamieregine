import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

    // Vérification de la présence du token
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Erreur lors du chargement des utilisateurs', err);
        alert("Impossible de charger les utilisateurs");
      }
    };

    fetchUsers();
  }, [token]);

  return (
    <div>
      <h2>👤 Liste des utilisateurs</h2>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
