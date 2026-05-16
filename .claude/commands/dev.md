---
description: Démarre le dev server Next.js en background et affiche le port
---

Lance `npm run dev` dans `la-symphonie-electrique/` en background (Bash avec `run_in_background: true`).

Attends 3-5 secondes que le serveur démarre, puis :
1. Vérifie via `curl http://localhost:3000` ou par lecture du output du job qu'il répond.
2. Donne à l'utilisateur l'URL exacte (localhost:3000 par défaut, mais Next peut basculer sur 3001 si 3000 est pris — lire le log pour le vrai port).
3. Rappelle qu'il peut tuer le serveur avec le tool KillBash.

Si `.env.local` n'existe pas ou `JWT_SECRET` est vide, prévenir avant de lancer — l'app refusera de démarrer.
