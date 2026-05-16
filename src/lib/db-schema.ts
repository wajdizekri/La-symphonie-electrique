/**
 * Initialisation + migrations du schéma pour la couche async (libSQL/Turso).
 * Miroir exact de db.ts — même SQL SQLite. Idempotent : sûr d'appeler à chaque boot.
 *
 * À appeler une fois depuis instrumentation.ts (runtime nodejs) une fois la
 * migration des consommateurs terminée.
 */
import { randomUUID } from 'node:crypto';
import { q } from '@/lib/db-async';

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    service_type TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    budget_estimate REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients (id)
  );
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'in_progress',
    start_date DATE,
    end_date DATE,
    image_before TEXT,
    image_after TEXT,
    tracking_token TEXT UNIQUE,
    internal_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients (id)
  );
  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    stripe_session_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects (id)
  );
  CREATE TABLE IF NOT EXISTS interventions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    start_time TEXT,
    client_id INTEGER,
    status TEXT DEFAULT 'scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients (id)
  );
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

let initialized = false;

export async function ensureSchema() {
  if (initialized) return;

  await q.exec(SCHEMA);

  // Migrations idempotentes (colonnes ajoutées après coup).
  const projectCols = await q.all<{ name: string }>("PRAGMA table_info(projects)");
  if (!projectCols.some(c => c.name === 'tracking_token')) {
    await q.run("ALTER TABLE projects ADD COLUMN tracking_token TEXT");
  }
  if (!projectCols.some(c => c.name === 'internal_notes')) {
    await q.run("ALTER TABLE projects ADD COLUMN internal_notes TEXT");
  }
  await q.run("CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_tracking_token ON projects(tracking_token)");

  const requestCols = await q.all<{ name: string }>("PRAGMA table_info(requests)");
  if (!requestCols.some(c => c.name === 'images')) {
    await q.run("ALTER TABLE requests ADD COLUMN images TEXT");
  }

  const orphans = await q.all<{ id: number }>("SELECT id FROM projects WHERE tracking_token IS NULL");
  if (orphans.length > 0) {
    await q.batch(
      orphans.map(o => ({
        sql: "UPDATE projects SET tracking_token = ? WHERE id = ?",
        args: [randomUUID(), o.id],
      }))
    );
  }

  initialized = true;
}
