/**
 * Approuve un compte admin (status='approved') pour débloquer l'accès au back-office.
 *
 * Usage :
 *   node scripts/approve-admin.mjs                 → approuve l'admin id=1
 *   node scripts/approve-admin.mjs admin@mail.fr   → approuve par email
 *
 * Marche en local (file:database.sqlite) ET en prod (Turso) — lit LIBSQL_URL.
 * Charge automatiquement .env.local si présent.
 */
import { createClient } from '@libsql/client';
import { readFileSync, existsSync } from 'node:fs';

// Charge .env.local manuellement (pas de dépendance dotenv)
if (existsSync('.env.local')) {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const url = process.env.LIBSQL_URL || 'file:database.sqlite';
const authToken = process.env.LIBSQL_AUTH_TOKEN;
const arg = process.argv[2];

const db = createClient({ url, authToken });

const where = arg ? 'email = ?' : 'id = 1';
const args = arg ? [arg] : [];

const res = await db.execute({ sql: `UPDATE users SET status = 'approved' WHERE ${where}`, args });
if (res.rowsAffected === 0) {
  console.error(`❌ Aucun utilisateur trouvé (${arg ?? 'id=1'}).`);
  process.exit(1);
}
const check = await db.execute({ sql: `SELECT id, name, email, status FROM users WHERE ${where}`, args });
console.log('✅ Admin approuvé :', check.rows[0]);
