import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { useClientAuth } from '../../../context/ClientAuthContext.jsx';
import './style.css';

export default function AccountPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    sex: 'other',
  });

  const [loading, setLoading]   = useState(true);
  const [err, setErr]           = useState('');
  const [ok, setOk]             = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const { logout } = useClientAuth(); // 🆕 pour pouvoir déconnecter le client

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const { data } = await api.get('/me'); // Authorization via intercepteur
        setForm({
          firstName: data?.firstName || '',
          lastName:  data?.lastName  || '',
          email:     data?.email     || '',
          sex:       data?.sex       || 'other',
        });
      } catch (e) {
        const msg =
          e?.response?.status === 401
            ? 'Veuillez vous reconnecter.'
            : e?.response?.data?.message || 'Impossible de charger votre profil.';
        setErr(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!isEditing) return; // on ne soumet pas si on n'est pas en mode édition

    try {
      setOk('');
      setErr('');
      const { data } = await api.put('/me', form);
      setForm({
        firstName: data?.firstName || '',
        lastName:  data?.lastName  || '',
        email:     data?.email     || '',
        sex:       data?.sex       || 'other',
      });
      setOk('Profil mis à jour.');
      setIsEditing(false);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Mise à jour impossible.');
    }
  };

  const handleCancelEdit = () => {
    // On recharge les données depuis l’API pour annuler proprement
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/me');
        setForm({
          firstName: data?.firstName || '',
          lastName:  data?.lastName  || '',
          email:     data?.email     || '',
          sex:       data?.sex       || 'other',
        });
      } catch (e) {
        // si erreur ici, on garde juste les valeurs actuelles
      } finally {
        setLoading(false);
        setIsEditing(false);
        setErr('');
        setOk('');
      }
    })();
  };

  const handleDeleteAccount = async () => {
    const sure = window.confirm(
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est définitive.'
    );
    if (!sure) return;

    try {
      setDeleting(true);
      setErr('');
      setOk('');

      // Suppression côté back
      await api.delete('/me');

      // 🆕 On déconnecte le client (clear token / contexte)
      logout();

      // Message + redirection
      setOk("Votre compte a été supprimé. Vous allez être redirigé vers l'accueil.");

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Suppression du compte impossible.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="acc-container">
        <section className="acc-card">
          <div className="acc-loading">Chargement…</div>
        </section>
      </main>
    );
  }

  return (
    <main className="acc-container">
      <section className="acc-card" aria-labelledby="account-title">
        <h1 id="account-title" className="acc-title">Mon compte</h1>

        {ok && <div className="acc-success">{ok}</div>}
        {err && <div className="acc-error">{err}</div>}

        <form onSubmit={submit} className="acc-form">
          <div className="acc-field">
            <label htmlFor="prenom">Prénom</label>
            <input
              id="prenom"
              value={form.firstName}
              onChange={(e) =>
                setForm((f) => ({ ...f, firstName: e.target.value }))
              }
              className="acc-input"
              required
              disabled={!isEditing}
            />
          </div>

          <div className="acc-field">
            <label htmlFor="nom">Nom</label>
            <input
              id="nom"
              value={form.lastName}
              onChange={(e) =>
                setForm((f) => ({ ...f, lastName: e.target.value }))
              }
              className="acc-input"
              required
              disabled={!isEditing}
            />
          </div>

          <div className="acc-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className="acc-input"
              required
              disabled={!isEditing}
            />
          </div>

          <div className="acc-field">
            <label htmlFor="sex">Sexe</label>
            <select
              id="sex"
              value={form.sex}
              onChange={(e) =>
                setForm((f) => ({ ...f, sex: e.target.value }))
              }
              className="acc-input"
              disabled={!isEditing}
            >
              <option value="H">Homme</option>
              <option value="F">Femme</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div className="acc-actions">
            {!isEditing ? (
              <button
                type="button"
                className="acc-btn-secondary"
                onClick={() => setIsEditing(true)}
              >
                Modifier mes informations
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="acc-btn-secondary"
                  onClick={handleCancelEdit}
                >
                  Annuler
                </button>
                <button type="submit" className="acc-btn-primary">
                  Enregistrer
                </button>
              </>
            )}
          </div>
        </form>

        <div className="acc-delete-zone">
          <button
            type="button"
            className="acc-btn-delete"
            onClick={handleDeleteAccount}
            disabled={deleting}
          >
            {deleting ? 'Suppression…' : 'Supprimer mon compte'}
          </button>
        </div>
      </section>
    </main>
  );
}
