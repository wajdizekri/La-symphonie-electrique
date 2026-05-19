/**
 * Purge les DONNÉES DE TEST avant mise en production.
 *
 * Vide : clients, requests, projects, payments, interventions, users.
 * CONSERVE : les avis (reviews) avec status='approved' (vrais avis Google).
 *
 * ⚠️ DESTRUCTIF ET IRRÉVERSIBLE. N'exécute rien sans le flag --confirm.
 *
 *   node scripts/reset-prod-db.mjs            → dry-run (montre ce qui serait supprimé)
 *   node scripts/reset-prod-db.mjs --confirm  → exécute réellement
 *
 * Fais une COPIE de database.sqlite avant (cp database.sqlite database.sqlite.bak).
 */
import Database from 'better-sqlite3';
import { existsSync, copyFileSync } from 'node:fs';

const DB = 'database.sqlite';
const confirm = process.argv.includes('--confirm');

if (!existsSync(DB)) {
  console.error(`❌ ${DB} introuvable (lance depuis la racine du projet).`);
  process.exit(1);
}

const db = new Database(DB);
const tables = ['payments', 'projects', 'requests', 'interventions', 'clients', 'users'];

console.log('--- État actuel ---');
for (const t of tables) {
  const { c } = db.prepare(`SELECT COUNT(*) c FROM ${t}`).get();
  console.log(`  ${t.padEnd(14)} : ${c} ligne(s) → seront SUPPRIMÉES`);
}
const keptReviews = db.prepare("SELECT COUNT(*) c FROM reviews WHERE status='approved'").get().c;
const dropReviews = db.prepare("SELECT COUNT(*) c FROM reviews WHERE status!='approved'").get().c;
console.log(`  reviews        : ${keptReviews} approuvés CONSERVÉS, ${dropReviews} non-approuvés supprimés`);

if (!confirm) {
  console.log('\nℹ️  DRY-RUN. Rien supprimé. Relance avec --confirm pour exécuter.');
  process.exit(0);
}

// Sauvegarde de sécurité automatique
const bak = `${DB}.pre-reset.bak`;
copyFileSync(DB, bak);
console.log(`\n🛟 Sauvegarde créée : ${bak}`);

const tx = db.transaction(() => {
  for (const t of tables) db.prepare(`DELETE FROM ${t}`).run();
  db.prepare("DELETE FROM reviews WHERE status != 'approved'").run();
  // Remet les compteurs d'auto-incrément à zéro (si table sqlite_sequence existe)
  try { db.prepare("DELETE FROM sqlite_sequence WHERE name NOT IN ('reviews')").run(); } catch {}
});
tx();

console.log('✅ Base purgée. Données de test supprimées, avis approuvés conservés.');
console.log('➡️  Crée maintenant le vrai compte admin via /admin/register puis : npm run approve-admin <email>');
