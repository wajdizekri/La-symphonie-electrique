/**
 * Insère les vrais avis Google (fiche LA SYMPHONIE ÉLECTRIQUE, Thyez) dans la table reviews.
 * status='approved' → affichés directement sur /avis.
 * Idempotent : n'insère pas un avis déjà présent (même name + comment).
 *
 * Usage (depuis la racine du projet) :
 *   node scripts/seed-google-reviews.mjs            → détecte la DB (.next/standalone en prod, sinon racine)
 *   node scripts/seed-google-reviews.mjs <chemin>   → force le fichier DB
 */
import Database from 'better-sqlite3';
import { existsSync } from 'node:fs';

const candidates = [process.argv[2], '.next/standalone/database.sqlite', 'database.sqlite'].filter(Boolean);
const dbPath = candidates.find((p) => existsSync(p));
if (!dbPath) {
  console.error('❌ Aucune base trouvée (.next/standalone/database.sqlite ou database.sqlite).');
  process.exit(1);
}

// Avis réels récupérés le 2026-07-10 (note 5/5 chacun). created_at approximatif d'après l'ancienneté Google.
const reviews = [
  { name: 'Claudine Sauce', rating: 5, created_at: '2026-07-05 10:00:00', comment: "Merci pour l'installation rapide et les conseils. Très professionnel je recommande les yeux fermés !" },
  { name: 'ION ERDIC', rating: 5, created_at: '2026-07-03 10:00:00', comment: 'Très réactif, travail soigné et de qualité. À garder dans les contacts.' },
  { name: 'Orianne Aymard', rating: 5, created_at: '2026-05-10 10:00:00', comment: "Jaber est intervenu à deux reprises dans deux logements différents pour permettre l'accès à la fibre, alors que les techniciens Orange n'avaient pas réussi à résoudre le problème. À chaque fois, il a été très efficace et a su trouver des solutions là où d'autres bloquaient. Son travail est soigné, rapide et vraiment professionnel. En plus de ses compétences techniques, Jaber est très sympathique, ponctuel et agréable dans les échanges. Je le recommande vivement !" },
  { name: 'Itidel Smati', rating: 5, created_at: '2026-01-10 10:00:00', comment: "Jaber fait preuve d'un grand professionnalisme et d'un réel sérieux. Son travail est soigné, transparent et de qualité. Je le recommande sans hésitation. Bonne continuation." },
  { name: 'Selima Kadri', rating: 5, created_at: '2026-01-10 10:00:00', comment: 'Jaber est super professionnel, je ne peux que vous le recommander les yeux fermés. Travail de qualité, réalisé avec honnêteté. Bonne continuation pour la suite.' },
  { name: 'Guillaume Chappaz', rating: 5, created_at: '2026-01-10 10:00:00', comment: 'Jaber est un super professionnel, disponible et juste dans ses devis et interventions.' },
  { name: 'Benjamin Lazzari', rating: 5, created_at: '2026-01-10 10:00:00', comment: "Excellente expérience avec La Symphonie Électrique et son dirigeant Jaber. Professionnel, réactif et à l'écoute du client. Le travail est soigné, réalisé dans les délais et avec de très bons conseils tout au long du projet. On sent un vrai savoir-faire et une passion pour le métier. Je recommande vivement cette société pour tous vos travaux électriques." },
  { name: 'michel Angelo', rating: 5, created_at: '2026-01-10 10:00:00', comment: 'Je le recommande vivement, très compétent et toujours disponible.' },
];

const db = new Database(dbPath);
const exists = db.prepare('SELECT 1 FROM reviews WHERE name = ? AND comment = ?');
const insert = db.prepare("INSERT INTO reviews (name, rating, comment, status, created_at) VALUES (?, ?, ?, 'approved', ?)");

let added = 0;
for (const r of reviews) {
  if (!exists.get(r.name, r.comment)) {
    insert.run(r.name, r.rating, r.comment, r.created_at);
    added++;
  }
}
console.log(`✅ ${dbPath} — ${added} avis ajoutés (sur ${reviews.length}), les doublons éventuels ont été ignorés.`);
