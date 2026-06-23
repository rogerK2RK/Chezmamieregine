# Chez Mamie Régine

Cuisine malgache faite maison — **livraison** (Lyon) + **traiteur événementiel**.
Commandes par **WhatsApp** ou **téléphone** (pas de panier en ligne).

Monorepo : `frontend/` (React + Vite) · `backend/` (Express + MongoDB) · `api/` (entrée serverless Vercel).

## Lancer en local

### Backend
```bash
cd backend
cp .env.example .env   # puis remplir MONGO_URI, JWT_SECRET, SUPERADMIN_*
npm install
npm run dev            # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

## Variables d'environnement (backend/.env)
Voir `backend/.env.example`. `JWT_SECRET` est **obligatoire** (le serveur refuse de démarrer sans).
Générer : `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

Le compte admin est créé au 1er démarrage à partir de `SUPERADMIN_NAME/EMAIL/PASSWORD`
(si la base ne contient aucun admin). Connexion admin : `/admin/login`.

## Déploiement
- **MongoDB Atlas** (M0), réseau `0.0.0.0/0`.
- **Render** (backend) : root `backend/`, start `npm start`, variables d'env.
- **Vercel** (frontend) : root `frontend/`, `VITE_API_URL` = URL Render + `/api`.

## Direction artistique
« Atelier » — papier clair, orange `#EF5007`, titres Anton (capitales) + accent Fraunces italique,
formes anguleuses, animations au scroll. Voir `frontend/src/index.css` (tokens).
