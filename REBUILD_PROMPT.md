# Prompt de recréation — « Chez Mamie Régine »

> Colle ce prompt dans une nouvelle session (Claude Code ou équivalent) pour reconstruire le projet de A à Z.
> Aucune donnée secrète n'est incluse : tous les numéros, emails et clés sont des **placeholders** à remplacer.

---

## RÔLE
Tu es un développeur full-stack. Construis un site **restaurant** complet, moderne, rapide et intuitif, avec un back-office d'administration. Le rendu ne doit PAS « faire IA » : design éditorial soigné, animations sobres.

## LE CONCEPT
**Chez Mamie Régine** — cuisine **malgache faite maison**, **sans lieu physique** :
- **Livraison** (zone : Lyon) + **traiteur événementiel** (mariages, anniversaires, baptêmes, entreprises).
- **Pas de panier ni de paiement en ligne.** Toute commande se fait par **appel téléphonique** ou **WhatsApp** (lien `wa.me` avec message pré-rempli). Chaque CTA « Commander » pointe vers `tel:` ou `wa.me`, jamais vers un tunnel d'achat.

## STACK
- **Frontend** : React 19 + Vite 6 + React Router 7 + axios. CSS « vanilla » (un design system de variables CSS, pas de Tailwind). `lenis` pour le smooth-scroll de l'accueil.
- **Backend** : Node.js + Express 4 + MongoDB (Mongoose) + JWT (`jsonwebtoken`) + `bcryptjs` + `multer` (uploads, stockage GridFS) + `cors` + `dotenv`.
- **Hébergement cible** : frontend sur **Vercel**, backend sur **Render**, base sur **MongoDB Atlas (M0 gratuit)**.
- Monorepo : `/frontend` et `/backend`.

---

## DIRECTION ARTISTIQUE — « Atelier » (éditoriale, affiche)
- **Mode clair par défaut** (fond papier crème), thème pilotable clair/sombre via des **tokens CSS** (voir plus bas) — composants sensibles rendus adaptatifs avec `var(--color-secondary)` / `var(--color-bg)`.
- **Couleur punch unique : orange `#EF5007`** (à conserver impérativement). Reste de la palette : encre `#17120E`, papier `#F4ECDD`, blanc cassé `#FFFDF8`.
- **Typo** : titres « affiche » **Anton** (capitales, condensé) ; accent éditorial **Fraunces** italique (ex. un mot du titre en orange italique) ; corps **Manrope**.
- **Formes anguleuses** (petits border-radius), **ombres dures portées** (style affiche), **filets** fins, **gros numéros** de section (01/02/03), **mot filigrane** géant en fond de hero.
- **Animations** : révélation au scroll (IntersectionObserver → classe `is-visible`, translate + fondu, délais en cascade via `--reveal-delay`), bande défilante (marquee) de spécialités, indice de scroll animé, hover (lift, soulignés animés, zoom image). Respecter `prefers-reduced-motion`.
- Garder les **photos de plats** existantes (format `.jpg` optimisé).

### Tokens CSS (dans `frontend/src/index.css`)
Définir des variables : couleurs (`--color-primary`, `--color-ink`, `--color-paper`, `--color-surface`, `--color-surface-2`, alias `--color-secondary`=texte, `--color-bg`=fond, `--color-cream`/`--color-white`=surfaces, `--color-text-muted`, `--color-border`), espacements (`--space-*`), rayons (`--radius-*`), ombres (`--shadow-*`), typo (`--font-display`=Anton, `--font-serif`=Fraunces, `--font-body`=Manrope, échelle `--fs-*`), transitions (`--ease`, `--dur`), conteneurs (`--container`). Le passage clair↔sombre se fait en inversant `--color-secondary`, `--color-bg`, `--color-cream`, `--color-white`.

---

## FRONTEND — pages & composants

**Layouts/routing** (`AppRouter.jsx`) : `ClientLayout` (Header + Outlet + Footer ; appelle `useScrollReveal()` pour que TOUTES les pages révèlent les `[data-reveal]`) ; `AdminAuthLayout` (login admin) ; `AdminAppLayout` (espace admin protégé par `PrivateRoute` + rôles).

**Pages publiques** :
- **Accueil** (`HomePage`) avec smooth-scroll Lenis : `Hero` → `Reassurance` (bandeau confiance) → `Marquee` (spécialités défilantes) → `About` → `NosPlats` (aperçu menu) → `CommentCaMarche` (3 étapes : choisir / commander par appel‑WhatsApp / recevoir) → `Traiteur` (section événements, fond sombre, CTA devis WhatsApp) → `CTA` (bannière orange commander) → `ContactForm`.
- **Menu** (`/produits`, `ProductsPage`) : hero compact, chips de catégories, recherche + tri, cartes plats alternées avec badges ; bouton **« Commander » → WhatsApp pré-rempli (nom + prix)**, lien « Voir le plat » vers la fiche ; pagination « voir plus » ; suggestions.
- **Fiche plat** (`/produit/:id`, `ProductDetailPage`) : grande image encadrée, prix, badges, accompagnements, infos, allergènes, **boutons Commander WhatsApp / téléphone**, citation « Mamie », réassurance, section **commentaires/avis**.
- **Contact** (`/contact`) : rangée de **canaux rapides** (WhatsApp / Téléphone / Email) + formulaire (POST `/api/public/contact`) + carte OpenStreetMap.
- **Connexion** (`/connexion`) / **Inscription** (`/inscription`) : cartes claires, titre Anton, lien de bascule, feedback.
- **Compte** (`/account`), **404** (`ErrorPage`).

**Composants partagés** : `Header` (barre encre, logo, nav `Nos plats / Traiteur / Contact / Connexion / Inscription`, bouton **Commander → WhatsApp**, dropdown compte, menu burger mobile), `Footer` (marque, horaires, navigation dont Traiteur, contact dont WhatsApp + « Livraison à Lyon », réseaux), `Hero` (carrousel d'images en fondu), `Marquee`, `Reassurance`, `About`, `NosPlats`, `CommentCaMarche`, `Traiteur`, `CTA`, `ContactForm`, `SafeImage`.

**Code transverse** :
- `src/config/contact.js` : **source unique** des coordonnées → `PHONE_DISPLAY`, `TEL_LINK` (`tel:`), `WHATSAPP_NUMBER` (format international), `EMAIL`, et helpers `whatsappLink(message)`, `WA_ORDER`, `WA_CATERING`. (Valeurs = placeholders.)
- `src/hooks/useScrollReveal.js` : IntersectionObserver qui ajoute `.is-visible` aux `[data-reveal]`, + MutationObserver pour les éléments montés après navigation, + fallback `prefers-reduced-motion`.
- `src/services/api.js` : instance axios, `baseURL = (VITE_API_URL || http://localhost:5000) + /api` (sans doubler `/api`), intercepteur ajoutant `Authorization: Bearer <clientToken>` depuis le localStorage.
- `src/services/apiAdmin.js` : axios admin (token admin).
- `src/context/ClientAuthContext.jsx` & `AdminAuthContext.jsx`.
- `src/data/mockPlats.js` : jeux de plats/catégories de secours (affichage si l'API est indisponible).

**Back-office admin** (`/admin/...`) : `login`, `dashboard`, `plats` (+ `plats/new`, `plats/:id/edit`), `categories`, `commandes`, `clients`, `utilisateurs` (admins), `comments`, `contacts`. Protégé par rôles `admin | owner | superAdmin`.

---

## BACKEND — API Express/MongoDB

**Démarrage (CRUCIAL pour Render)** :
- `server.js` : `app.listen(PORT)` **immédiatement**, puis `app.init()` (connexion DB + superadmin) **en arrière-plan** (ne jamais bloquer le bind du port derrière la connexion DB, sinon Render voit le service mort).
- `app.js` : crée l'app, `trust proxy`, **route `/healthz` AVANT** le middleware d'init DB, middleware qui garantit la connexion DB par requête (mémoïsée), CORS, parsers, routes, 404 + error handler. Exporte `app` et `app.init`.
- `api/index.js` : `module.exports = require('../backend/app')` (entrée serverless si besoin).

**Sécurité JWT (CRUCIAL)** :
- `config/jwt.js` : lit `JWT_SECRET` et **lève une erreur au démarrage s'il est absent** (fail-fast). Exporte `JWT_SECRET` et `JWT_ADMIN_SECRET` (= `JWT_ADMIN_SECRET` env ou fallback `JWT_SECRET`). **Aucun secret en dur** (jamais de `'dev_secret'`). Tous les `sign`/`verify` passent par ce helper.

**Connexion DB** : `config/db.js` → `mongoose.connect(MONGO_URI, { dbName: DB_NAME || 'chezmamie' })`.

**Superadmin auto** : `utils/initAdmin.js` (`ensureSuperAdmin`) crée un `AdminUser` rôle `superAdmin` à partir de `SUPERADMIN_NAME/EMAIL/PASSWORD` **si aucun admin n'existe**.

**Modèles (Mongoose)** : `AdminUser` (adminId `ADM-000001` via compteur, name, email unique, password hashé, role enum), `Client` (firstName, lastName, sex, email unique, password, clientId), `User` (legacy), `Plat` (name, description, price, images, category/categories, badges, sideDishes, infos, allergenes, isAvailable…), `Category` (name, slug), `Commande` (items, total — **recalculé côté serveur**, jamais fait confiance au client), `Comment`, `Contact`, `Counter` (génération d'ID séquentiels).

**Routes / endpoints** :
- Public (aucune auth) : `GET /api/public/plats`, `GET /api/public/plats/:id`, `GET /api/public/categories`, `POST /api/public/contact`.
- Auth client : `POST /api/auth/register`, `POST /api/auth/login`, profil via `/api/me` (protégé `clientProtect`).
- Admin : `POST /api/admin/login`, CRUD plats/catégories/commandes/clients/admins/commentaires/contacts (protégé `adminProtect` + contrôle de rôle).
- Uploads : `/api/uploads` (multer + GridFS).
- `GET /healthz` et `GET /api/health`.

**Middleware** : `clientProtect` (vérifie le JWT client), `adminProtect` (vérifie le JWT admin + rôle), `roleMiddleware`.

**Validation & sécurité** : valider les entrées (regex nom/email/mot de passe), **échapper les regex utilisateur** avant tout `$regex` (anti-ReDoS/NoSQL), hacher les mots de passe (bcrypt), **ne jamais renvoyer de mot de passe en clair**. Ajouter (recommandé) `helmet` + `express-rate-limit` sur les routes d'auth.

**CORS** : autoriser `http://localhost:5173`, le domaine Vercel de prod, et `FRONT_ORIGIN` (env), avec `credentials: true`.

---

## VARIABLES D'ENVIRONNEMENT
Backend (`backend/.env`, **gitignoré** ; fournir un `backend/.env.example` avec des valeurs VIDES — le repo est public, ne JAMAIS committer de secret) :
```
MONGO_URI=            # chaîne Atlas mongodb+srv://...
DB_NAME=chezmamie
JWT_SECRET=           # OBLIGATOIRE (générer: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))")
JWT_ADMIN_SECRET=     # optionnel
SUPERADMIN_NAME=
SUPERADMIN_EMAIL=
SUPERADMIN_PASSWORD=
FRONT_ORIGIN=         # ex. https://<app>.vercel.app
PORT=5000
```
Frontend : `VITE_API_URL=https://<backend-render>.onrender.com/api` (sur Vercel).

---

## DÉPLOIEMENT
1. **MongoDB Atlas** : créer un projet + cluster **M0 gratuit** (1 seul gratuit par projet → créer un nouveau projet si besoin), un user DB, et autoriser le réseau `0.0.0.0/0` (pour Render).
2. **Render** (backend) : root `backend/`, build `npm install`, start `npm start` ; définir toutes les variables d'env ci-dessus (surtout `MONGO_URI` et `JWT_SECRET`).
3. **Vercel** (frontend) : root `frontend/`, framework Vite ; définir `VITE_API_URL` vers l'URL Render `/api` ; `vercel.json` avec rewrites SPA.

## PIÈGES À ÉVITER (leçons du projet)
- Lier le port **avant** l'init DB (sinon Render injoignable).
- `JWT_SECRET` manquant en prod = forge de tokens → fail-fast au boot, pas de fallback en dur.
- `.env.example` = modèle **vide** ; les vrais secrets uniquement dans `.env` (gitignoré) et les variables Render/Vercel.
- `total` des commandes **recalculé serveur** (ne pas faire confiance au client).
- Si un composant partagé utilise une animation `[data-reveal]`, s'assurer que `useScrollReveal()` tourne sur **toutes** les pages (dans le layout), sinon les éléments restent invisibles (`opacity:0`).
- Images en `.jpg` optimisé (poids).

## LIVRABLE
Repo monorepo fonctionnel (`/frontend` + `/backend`), README d'installation, `.env.example`, site public + admin opérationnels en local (`npm run dev` côté front, `npm run dev`/`start` côté back), prêt à déployer Render + Vercel + Atlas. Style « Atelier » appliqué de façon cohérente sur toutes les pages, commandes via WhatsApp/appel, section traiteur incluse.
