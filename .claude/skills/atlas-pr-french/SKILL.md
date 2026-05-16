---
name: atlas-pr-french
description: When drafting a pull request description for an Atlas Energies project, write in French using the team's standard sections (Contexte, Changements, Tests, Risques, Captures).
---

# Description de PR — convention Atlas Energies

## Quand l'appliquer

Tu rédiges la description d'une pull request (via `gh pr create`, dans la conversation, ou pour un copier-coller). Le projet appartient à Atlas Energies (ex : `la-symphonie-electrique`).

## Format à respecter

```markdown
## Contexte

Pourquoi ce changement existe : ticket, problème métier, ou observation utilisateur.
Une à trois phrases. Lien vers l'issue ou le ticket si applicable.

## Changements

- Liste à puces des modifications notables, du point de vue *reviewer*, pas chronologique.
- Une puce = une décision technique ou un fichier-clé.
- Mentionner les ajouts/suppressions de dépendances explicitement.

## Tests

- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests d'intégration vérifiés en local
- [ ] Build & lint passent (`npm run build`, `npm run lint`)
- Décrire en une phrase le scénario manuel testé si pertinent.

## Risques

Ce qui pourrait casser, ce qui n'est pas couvert, dette technique introduite.
"Aucun risque identifié" est acceptable seulement après réflexion explicite — pas par défaut.

## Captures (si UI)

Avant / Après en markdown image si la PR touche au visuel.
```

## Règles

1. **Toujours en français.** Pas de mélange. Les noms techniques (component names, hooks, API endpoints) restent en anglais — c'est normal.
2. **Titre de PR** : impératif présent, ≤ 70 caractères, en français. Ex : `Ajoute le filtre par statut sur la liste des commandes`. Pas de préfixe `feat:`/`fix:` sauf si la repo a une convention Conventional Commits visible.
3. **Pas d'emoji** sauf si l'utilisateur en met d'abord.
4. **Pas de signature "Generated with Claude Code"** — sauf demande explicite.
5. **Vérifier que la section Tests est cochée honnêtement** : si rien n'a été testé, dire « non testé » plutôt que cocher.

## Quand sortir du format

Si la PR est triviale (typo, rename de variable, bump de version mineur), une seule ligne suffit — pas besoin des 5 sections. Juger.
