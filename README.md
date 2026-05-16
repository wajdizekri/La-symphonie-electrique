# La Symphonie Électrique

Site vitrine et back-office pour un électricien (électricité, fibre optique, IRVE, VMC).
Stack : Next.js 16 (App Router) + React 19 + better-sqlite3 + Stripe + Resend.

## Setup

```bash
npm install
cp .env.example .env.local
# Remplir les variables d'environnement — JWT_SECRET est obligatoire.
npm run dev
```

Le serveur refusera de démarrer si `JWT_SECRET` n'est pas défini.

### Bootstrap du premier admin

L'inscription crée toujours un compte avec `status='pending'`. Pour amorcer le premier admin :

```bash
sqlite3 database.sqlite "UPDATE users SET status='approved' WHERE id=1;"
```

Ensuite, ce compte peut approuver les suivants depuis `/admin/users`.

### Stripe en local

Pour tester le webhook avec la Stripe CLI :

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

La CLI affiche le `whsec_…` à coller dans `STRIPE_WEBHOOK_SECRET`.

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Lance le build de production |
| `npm run lint` | ESLint |

## Architecture

- `src/app/` — App Router (pages publiques + `/admin/*` protégé).
- `src/app/api/` — Route handlers (auth, Stripe, webhooks, admin CRUD).
- `src/lib/` — `db.ts` (better-sqlite3), `auth.ts` (JWT/bcrypt), `actions.ts` (Server Actions), `rate-limit.ts`.
- `src/proxy.ts` — Auth proxy (remplace `middleware.ts` en Next 16).

## Variables d'environnement

Voir [.env.example](.env.example). `JWT_SECRET` est obligatoire ; les autres dégradent gracieusement (paiement et emails désactivés).

## Notes

- Base de données : `better-sqlite3` + `database.sqlite` à la racine. **Incompatible avec un déploiement serverless** (Vercel). Pour la prod, migrer vers Postgres ou Turso.
- Tous les emails partent de `onboarding@resend.dev` par défaut — ne livre qu'aux adresses vérifiées du compte Resend. Configurer `RESEND_FROM_EMAIL` avec un domaine vérifié pour une vraie livraison.
