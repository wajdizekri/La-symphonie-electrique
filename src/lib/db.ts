import Database from 'better-sqlite3';
import path from 'path';
import { randomUUID } from 'node:crypto';

const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    status TEXT DEFAULT 'pending', -- pending, approved
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
    status TEXT DEFAULT 'pending', -- pending, approved, rejected, completed
    budget_estimate REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients (id)
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'in_progress', -- planning, in_progress, completed
    start_date DATE,
    end_date DATE,
    image_before TEXT,
    image_after TEXT,
    tracking_token TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients (id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, paid, failed
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
    status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients (id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, approved
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration: backfill tracking_token + add internal_notes on projects.
const projectCols = db.prepare("PRAGMA table_info(projects)").all() as { name: string }[];
if (!projectCols.some(c => c.name === 'tracking_token')) {
  db.exec("ALTER TABLE projects ADD COLUMN tracking_token TEXT");
}
if (!projectCols.some(c => c.name === 'internal_notes')) {
  db.exec("ALTER TABLE projects ADD COLUMN internal_notes TEXT");
}
db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_tracking_token ON projects(tracking_token)");

// Migration: add images JSON column to requests (stores array of relative URLs).
const requestCols = db.prepare("PRAGMA table_info(requests)").all() as { name: string }[];
if (!requestCols.some(c => c.name === 'images')) {
  db.exec("ALTER TABLE requests ADD COLUMN images TEXT");
}
const orphans = db.prepare("SELECT id FROM projects WHERE tracking_token IS NULL").all() as { id: number }[];
if (orphans.length > 0) {
  const update = db.prepare("UPDATE projects SET tracking_token = ? WHERE id = ?");
  const tx = db.transaction(() => {
    for (const row of orphans) update.run(randomUUID(), row.id);
  });
  tx();
}

// Migration: vérification email + réinitialisation mot de passe.
const userCols = db.prepare("PRAGMA table_info(users)").all() as { name: string }[];
if (!userCols.some(c => c.name === 'email_verification_token')) {
  db.exec("ALTER TABLE users ADD COLUMN email_verification_token TEXT");
}
if (!userCols.some(c => c.name === 'email_verified_at')) {
  db.exec("ALTER TABLE users ADD COLUMN email_verified_at DATETIME");
}
if (!userCols.some(c => c.name === 'password_reset_token')) {
  db.exec("ALTER TABLE users ADD COLUMN password_reset_token TEXT");
}
if (!userCols.some(c => c.name === 'password_reset_expires')) {
  db.exec("ALTER TABLE users ADD COLUMN password_reset_expires DATETIME");
}
db.exec("CREATE INDEX IF NOT EXISTS idx_users_email_verif_token ON users(email_verification_token)");
db.exec("CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token)");
// Comptes existants : marqués déjà vérifiés (sinon ils seraient bloqués au login).
db.prepare("UPDATE users SET email_verified_at = COALESCE(email_verified_at, created_at) WHERE email_verified_at IS NULL").run();

export default db;
