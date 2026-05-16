/**
 * Couche d'accès DB ASYNC — compatible Vercel/serverless via Turso (libSQL).
 *
 * ⚠️ SCAFFOLD : cette couche coexiste avec `db.ts` (better-sqlite3, sync) le temps
 * de migrer les ~20 consommateurs un par un. Une fois tous migrés, supprimer db.ts.
 *
 * Connexion :
 *   - Local  : LIBSQL_URL=file:database.sqlite      (aucun service externe)
 *   - Prod   : LIBSQL_URL=libsql://<db>.turso.io    + LIBSQL_AUTH_TOKEN=<token>
 *
 * Le SQL reste du SQLite (libSQL EST SQLite) — strftime, julianday, PRAGMA,
 * placeholders `?`, lastInsertRowid : tout fonctionne tel quel.
 */
import { createClient, type Client, type InValue } from '@libsql/client';

const url = process.env.LIBSQL_URL || 'file:database.sqlite';
const authToken = process.env.LIBSQL_AUTH_TOKEN;

declare global {
  // eslint-disable-next-line no-var
  var __libsql: Client | undefined;
}

// Singleton (évite d'ouvrir une connexion par requête en dev/hot-reload).
const client: Client = global.__libsql ?? createClient({ url, authToken });
if (process.env.NODE_ENV !== 'production') global.__libsql = client;

type Row = Record<string, unknown>;

export const q = {
  /** Première ligne ou undefined. Équivalent better-sqlite3 `.get()`. */
  async get<T = Row>(sql: string, args: InValue[] = []): Promise<T | undefined> {
    const res = await client.execute({ sql, args });
    return (res.rows[0] as T | undefined) ?? undefined;
  },

  /** Toutes les lignes. Équivalent `.all()`. */
  async all<T = Row>(sql: string, args: InValue[] = []): Promise<T[]> {
    const res = await client.execute({ sql, args });
    return res.rows as unknown as T[];
  },

  /** Écriture. Équivalent `.run()` → { changes, lastInsertRowid }. */
  async run(sql: string, args: InValue[] = []): Promise<{ changes: number; lastInsertRowid: number | bigint }> {
    const res = await client.execute({ sql, args });
    return {
      changes: res.rowsAffected,
      lastInsertRowid: res.lastInsertRowid ?? 0,
    };
  },

  /** Plusieurs statements en transaction (migrations, cascades). */
  async batch(statements: { sql: string; args?: InValue[] }[]) {
    return client.batch(statements.map(s => ({ sql: s.sql, args: s.args ?? [] })), 'write');
  },

  /** Exécute du SQL brut multi-statements (init schéma). */
  async exec(sql: string) {
    return client.executeMultiple(sql);
  },
};

export default client;
