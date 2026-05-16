---
name: symphonie-test-scaffold
description: When adding a new feature or non-trivial function to la-symphonie-electrique, scaffold an accompanying test in the same commit so coverage doesn't drift.
---

# Test scaffold reflex

## Quand l'appliquer

Tu viens d'ajouter ou tu vas ajouter :
- Une nouvelle fonction exportée
- Un nouveau composant React avec logique (pas un pur wrapper presentational)
- Un nouveau route handler / server action
- Une nouvelle requête DB / fonction de service
- Un utilitaire (parsing, formatting, validation)

…dans `la-symphonie-electrique/`.

## Quoi faire

1. **Identifie le framework de test** déjà en place (vitest, jest, playwright, node:test). Lis `package.json` `devDependencies` + `scripts.test`. Ne l'inventes pas.
2. **Place le test** selon la convention existante :
   - Co-located : `Foo.tsx` → `Foo.test.tsx` à côté
   - Dossier `__tests__/` ou `tests/`
   - Dossier `e2e/` pour Playwright
   Choisis la convention déjà majoritaire dans le repo.
3. **Couvre au minimum** :
   - Le **chemin nominal** (entrée valide → sortie attendue)
   - **Un cas d'erreur** ou de bord (input invalide, vide, null)
   - Pour les composants : qu'il *rend* sans crash + une interaction si applicable
4. **N'ajoute pas** un mock de DB / API si le projet utilise une vraie SQLite en test — utiliser l'instance de test réelle est souvent plus fiable.

## Quoi ne pas faire

- Ne pas créer un fichier de test vide ou avec un seul `it.skip` "pour plus tard" — c'est du bruit.
- Ne pas dupliquer la logique du code dans le test (`expect(add(2,3)).toBe(2+3)` ne teste rien).
- Ne pas étendre un mock partiel si le test devient illisible — préférer un vrai fixture.
- Ne pas marquer le test `completed` dans une todo list si `npm test` n'a pas été lancé avec succès.

## Boucle de vérification

Avant de dire « terminé » :

```powershell
npm test
```

Si la commande n'existe pas, regarder `package.json` pour le bon script (`test:unit`, `test:e2e`, etc.).
