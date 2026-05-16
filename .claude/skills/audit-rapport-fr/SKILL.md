---
name: audit-rapport-fr
description: When the user asks for an audit (security, performance, accessibility, code quality, dependencies), produce a structured markdown report in French with Severity / Finding / Evidence / Recommandation columns.
---

# Rapport d'audit en français

## Quand l'appliquer

L'utilisateur demande un audit, une revue, un état des lieux, un diagnostic :
- Audit de sécurité (OWASP, dépendances vulnérables, secrets, headers)
- Audit de performance (bundle size, requêtes DB, rendering, web vitals)
- Audit d'accessibilité (a11y, ARIA, contrastes, navigation clavier)
- Audit qualité de code (complexité, duplication, type coverage, lint)
- Audit de dépendances (versions obsolètes, licences, alternatives)

## Format de sortie

Écrit le rapport dans un fichier `audits/AAAA-MM-JJ-<type>.md` à la racine du projet audité. Si le dossier `audits/` n'existe pas, crée-le.

```markdown
# Audit <Type> — <Projet>

**Date** : AAAA-MM-JJ
**Périmètre** : <chemins / fichiers audités>
**Méthode** : <outils utilisés, lecture manuelle, etc.>

## Résumé exécutif

Trois à cinq phrases : note globale, principaux risques, recommandation prioritaire.

## Constats

| # | Gravité | Constat | Preuve | Recommandation |
|---|---------|---------|--------|----------------|
| 1 | 🔴 Critique | Description courte | `file.ts:42` ou commande | Action concrète |
| 2 | 🟠 Élevée | … | … | … |
| 3 | 🟡 Moyenne | … | … | … |
| 4 | 🟢 Faible | … | … | … |
| 5 | ℹ️ Info | … | … | … |

## Plan d'action priorisé

1. **Court terme** (cette semaine) — constats critiques #1…
2. **Moyen terme** (ce sprint) — constats élevés #…
3. **Long terme** (backlog) — constats moyens et faibles

## Hors périmètre

Ce qui n'a *pas* été audité et pourquoi (manque de contexte, hors scope, etc.). Important pour éviter la fausse sécurité.
```

## Règles

1. **En français.** Les noms techniques restent en anglais (`useEffect`, `JOIN`, `CSP`, `Lighthouse`).
2. **Une preuve par constat.** Pas de « il y a peut-être des problèmes XYZ » — montre le fichier:ligne ou la sortie de commande.
3. **Gravité justifiée.** Critique = exploit/crash en prod possible. Élevée = dégradation user majeure. Moyenne = à corriger mais sans urgence. Faible = nice-to-have. Info = constat neutre.
4. **Ne pas inventer.** Si tu n'as pas trouvé de problème dans une catégorie, écris-le explicitement (« Aucun secret trouvé dans le code source »).
5. **Outils** : préfère des commandes locales reproductibles (`npm audit`, `npx depcheck`, `eslint`, `tsc --noEmit`, etc.) avec leur sortie copiée comme preuve.
