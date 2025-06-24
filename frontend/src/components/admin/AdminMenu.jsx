import { Link } from 'react-router-dom';

export default function AdminMenu() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/admin/plats">Gérer les Plats</Link>
        </li>
        <li>
          <Link to="/admin/commandes">Gérer les Commandes</Link>
        </li>
      </ul>
    </nav>
  );
}
