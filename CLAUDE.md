@AGENTS.md

# La Symphonie Électrique — guide Claude

Site vitrine + back-office pour un électricien (électricité, fibre, IRVE, VMC). Voir [README.md](README.md) pour la doc utilisateur.

## Stack

- **Next.js 16.2.4** (App Router) — ⚠️ fork avec breaking changes, lire `node_modules/next/dist/docs/` avant tout code Next (cf. skill `symphonie-next-docs`).
- **React 19.2.4**.
- **TypeScript 5** strict (`tsconfig.json`).
- **better-sqlite3 12** sur `database.sqlite` à la racine — **incompatible serverless** (pas de Vercel).
- **Stripe** (`/api/webhooks/stripe`, checkout flow sur `/suivi`).
- **Resend** (emails transactionnels) + **Twilio** (SMS) — dégradent silencieusement si pas configurés.
- **Auth** : JWT (`jose`) + bcrypt, cookie httpOnly, protégé via `src/proxy.ts`.
- **Tailwind v4** + `@tailwindcss/postcss`, `clsx`, `tailwind-merge`.
- **Validation** : `zod` 4 partout côté serveur.

## Conventions de fichiers

- `src/app/` — pages publiques (`/`, `/services/*`, `/contact`, `/avis`, `/projets`, `/suivi`, `/mentions-legales`, `/confidentialite`).
- `src/app/admin/*` — back-office protégé (auth requise + `status='approved'`).
- `src/app/api/*` — Route handlers. Conventions :
  - `api/auth/*` — login / register / logout.
  - `api/admin/*` — CRUD protégé (vérifier le rôle dans le handler, pas seulement le proxy).
  - `api/webhooks/stripe` — vérifier signature avec `STRIPE_WEBHOOK_SECRET`.
- `src/lib/` :
  - `db.ts` — instance better-sqlite3 + migrations inline.
  - `auth.ts` — signature/verif JWT, hash bcrypt.
  - `actions.ts` — Server Actions (préférer aux route handlers pour les mutations depuis l'UI).
  - `rate-limit.ts` — rate-limiter mémoire (à remplacer si multi-instance).
- `src/proxy.ts` — **remplace `middleware.ts`** dans cette version de Next. Ne JAMAIS créer un `middleware.ts`.
- `src/components/ui/` — primitives (button, input, etc.).
- `src/components/admin/` — composants spécifiques au back-office.

## Commandes

| Commande | Effet |
|---|---|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | Build de prod |
| `npm run start` | Lance le build |
| `npm run lint` | ESLint (`eslint-config-next`) |
| `stripe listen --forward-to localhost:3000/api/webhooks/stripe` | Forward webhook Stripe local |
| `sqlite3 database.sqlite "..."` | Inspection DB read-only — pour les écritures, voir skill `symphonie-sqlite-migrations` |

Pas de script `test` configuré — si tu ajoutes des tests, propose le framework (vitest recommandé pour Next 16/React 19) avant d'écrire.

## Variables d'environnement (`.env.local`)

`JWT_SECRET` est **obligatoire** — l'app refuse de démarrer sans. Toutes les autres dégradent gracieusement. Voir [.env.example](.env.example).

## Gotchas pour Claude

1. **Next.js fork** — ne jamais coder de mémoire ; lire la doc locale (cf. skill `symphonie-next-docs`). Tu vas tomber sur `getServerSideProps` ou des conventions pré-App-Router → vérifier qu'elles existent encore dans `node_modules/next/dist/docs/`.
2. **`src/proxy.ts` ≠ `middleware.ts`** — c'est le même rôle (intercepter les requêtes pour l'auth) mais le fichier s'appelle `proxy.ts` dans cette version. Ne pas tenter de le renommer.
3. **`database.sqlite` est versionné ?** vérifier `.gitignore` avant chaque commit — la DB de dev ne doit pas être pushée.
4. **Migrations** — pas de framework de migration installé ; les schémas vivent dans `src/lib/db.ts`. Modifs schéma = modifier `db.ts` + script SQL idempotent (skill `symphonie-sqlite-migrations`).
5. **Bootstrap admin** : `sqlite3 database.sqlite "UPDATE users SET status='approved' WHERE id=1;"` (cf. README).
6. **`bodySizeLimit: '30mb'`** sur les Server Actions — utile pour les uploads de photos de projets/avis.
7. **CSP stricte** dans `next.config.ts` — toute lib externe (Stripe.js, etc.) doit être whitelistée dans `connect-src` / `script-src`.

## Skills disponibles pour ce projet

Voir `.claude/skills/` :
- `symphonie-next-docs` — forcer la lecture des docs Next locales.
- `symphonie-sqlite-migrations` — discipline de modif schéma.
- `symphonie-test-scaffold` — test avec chaque feature.
- `atlas-pr-french` — template de PR FR.
- `audit-rapport-fr` — format de rapport d'audit FR.

## Langue

Le projet est en français (UI, copy, commits). Réponses Claude en français aussi, sauf demande contraire.
