---
description: Scaffold une migration SQLite selon la convention du projet (voir skill symphonie-sqlite-migrations)
argument-hint: <description-courte-snake-case>
---

L'utilisateur veut ajouter une migration. Description : `$ARGUMENTS`

1. **Active le skill `symphonie-sqlite-migrations`** mentalement — applique ses règles.
2. **Lis `src/lib/db.ts`** pour comprendre le schéma actuel et où vivent les définitions de tables.
3. Le projet n'a pas de framework de migrations dédié ; les schémas sont dans `db.ts` avec des `CREATE TABLE IF NOT EXISTS`. Pour une vraie évolution :
   - Ajoute le `CREATE TABLE / ALTER TABLE` idempotent dans `db.ts` (idempotent = peut s'exécuter deux fois sans erreur).
   - Si c'est un ALTER complexe (rename column, add NOT NULL), écris une fonction de migration dédiée avec un check de version (`PRAGMA user_version`).
4. **Demande à l'utilisateur** si cette migration doit être appliquée immédiatement à `database.sqlite` ou seulement préparée pour le prochain démarrage.
5. **Avant de marquer terminé** : `npm run build` doit passer, ou au minimum `npx tsc --noEmit` doit être propre.

Si pas d'`$ARGUMENTS` fourni, demande à l'utilisateur la description de la migration avant de commencer.
