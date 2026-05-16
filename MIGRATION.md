# Migration SQLite (sync) → libSQL/Turso (async) pour Vercel

## Pourquoi

`better-sqlite3` est synchrone et écrit sur le disque local → **incompatible serverless** (Vercel/Netlify). On migre vers **Turso (libSQL)** : c'est du SQLite côté SQL (aucune réécriture de requête), seul l'accès passe en **async**.

## État actuel (scaffold en place)

- ✅ `src/lib/db-async.ts` — client libSQL + helper `q.get/all/run/batch/exec`
- ✅ `src/lib/db-schema.ts` — `ensureSchema()` async idempotent (miroir de `db.ts`)
- ✅ `src/lib/storage.ts` — `saveUpload()` (Vercel Blob en prod, FS en local)
- ✅ `@libsql/client` + `@vercel/blob` installés
- ⏳ `src/lib/db.ts` (better-sqlite3) **toujours actif** — les 22 consommateurs l'utilisent encore

## Setup Turso (à faire avant de migrer)

```bash
# 1. Installer la CLI Turso (https://docs.turso.tech/cli/installation)
# 2. turso auth signup
# 3. turso db create symphonie-electrique
# 4. turso db show symphonie-electrique --url        → LIBSQL_URL
# 5. turso db tokens create symphonie-electrique     → LIBSQL_AUTH_TOKEN
```

`.env.local` (dev) peut rester `LIBSQL_URL=file:database.sqlite` (aucun service).
Vercel : définir `LIBSQL_URL`, `LIBSQL_AUTH_TOKEN`, et activer l'intégration **Vercel Blob** (fournit `BLOB_READ_WRITE_TOKEN`).

## Procédure de migration (fichier par fichier)

Pour **chaque** fichier de la liste ci-dessous :

1. Remplacer `import db from '@/lib/db'` → `import { q } from '@/lib/db-async'`
2. Convertir les appels :
   - `db.prepare(SQL).get(a, b)` → `await q.get<T>(SQL, [a, b])`
   - `db.prepare(SQL).all(a)`     → `await q.all<T>(SQL, [a])`
   - `db.prepare(SQL).run(a)`     → `await q.run(SQL, [a])`
   - `result.lastInsertRowid`     → idem (renvoyé par `q.run`)
   - `result.changes`             → idem
   - `db.transaction(fn)`         → `await q.batch([{sql, args}, ...])`
3. Rendre la fonction/page **async** si elle ne l'est pas (les Server Components peuvent être async ; les composants client NON → passer par une route API ou un Server Component parent).
4. `await ensureSchema()` au début des Server Components/routes qui lisent la DB (ou centraliser dans `instrumentation.ts`).
5. Tester la page **contre la vraie base Turso**.

## Checklist des 22 fichiers à convertir

### Server Components (déjà async-capables)
- [ ] `src/app/page.tsx`
- [ ] `src/app/admin/dashboard/page.tsx`
- [ ] `src/app/admin/reviews/page.tsx`
- [ ] `src/app/admin/payments/page.tsx`
- [ ] `src/app/admin/clients/page.tsx`
- [ ] `src/app/admin/clients/[id]/page.tsx`
- [ ] `src/app/admin/projects/page.tsx`
- [ ] `src/app/admin/projects/[id]/page.tsx`
- [ ] `src/app/admin/requests/page.tsx`
- [ ] `src/app/admin/users/page.tsx`
- [ ] `src/app/admin/planning/page.tsx`
- [ ] `src/app/admin/payments/[id]/invoice/page.tsx`

### Route handlers (async natif)
- [ ] `src/app/api/reviews/route.ts`
- [ ] `src/app/api/projects/[token]/route.ts`
- [ ] `src/app/api/admin/requests/[id]/route.ts`
- [ ] `src/app/api/admin/payments/route.ts`
- [ ] `src/app/api/admin/users/[id]/route.ts`
- [ ] `src/app/api/admin/clients/route.ts`
- [ ] `src/app/api/auth/register/route.ts`
- [ ] `src/app/api/auth/login/route.ts`
- [ ] `src/app/api/webhooks/stripe/route.ts`

### Server Actions
- [ ] `src/lib/actions.ts` (le plus gros — submitRequest, updateProject, deleteClient cascade via `q.batch`, etc.) + brancher `saveUpload()` à la place du bloc writeFile

### Finalisation
- [ ] `src/lib/db.ts` supprimé, `better-sqlite3` retiré du package.json
- [ ] `instrumentation.ts` appelle `ensureSchema()`
- [ ] Données existantes migrées : `turso db shell symphonie-electrique < dump.sql`
      (dump depuis SQLite : `sqlite3 database.sqlite .dump > dump.sql`)
- [ ] Test e2e complet : devis → acceptation → facture → paiement Stripe → webhook

## Pièges connus

- **Composants client** qui lisaient `db` directement : aucun ici (déjà via API/Server Components) ✅
- `q.run` renvoie `lastInsertRowid` en `number | bigint` → caster si besoin (`Number(...)`)
- Les transactions multi-étapes (deleteClient/deleteProject cascade) → `q.batch([...])` atomique
- `PRAGMA table_info` fonctionne en libSQL ✅
- Dates : `strftime`/`julianday` fonctionnent en libSQL ✅ (rien à réécrire)
