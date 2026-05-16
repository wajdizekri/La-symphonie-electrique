---
name: symphonie-sqlite-migrations
description: When modifying the SQLite schema in la-symphonie-electrique (database.sqlite), write a versioned migration script instead of mutating the DB directly, so changes are reproducible across dev machines and CI.
---

# SQLite migrations discipline

## When this applies

You are about to:
- Add, drop, or alter a table or column
- Add or remove an index / constraint / trigger
- Seed reference data that must exist for the app to boot
- Run `ALTER TABLE`, `CREATE TABLE`, `DROP …`, `CREATE INDEX`, etc. against `database.sqlite`

…in `la-symphonie-electrique/`.

## What to do

1. **Look for an existing migrations directory** in the project before assuming one — common paths: `src/db/migrations/`, `migrations/`, `drizzle/`, `prisma/migrations/`. Use whatever the project already has.
2. **If no migration system exists**, ask the user before introducing one — don't pick a tool unilaterally (drizzle-kit, better-sqlite3 migrate, knex, etc.).
3. **Write the migration as a new file** with a sortable prefix (timestamp or zero-padded sequence) and a descriptive name: `20260514_1430_add_orders_status_column.sql` or `0007_add_orders_status_column.ts`.
4. **Include a rollback** (down migration) unless the project explicitly chose forward-only.
5. **Never edit `database.sqlite` interactively** as the source of truth — the binary file is an output, not the schema definition.
6. **Don't commit `database.sqlite`** itself if it's already in `.gitignore`. Verify before staging.

## What not to do

- Don't run `sqlite3 database.sqlite "ALTER TABLE …"` to "just make the change" without a migration file.
- Don't rename or modify an existing committed migration file — write a new one that supersedes it.
- Don't reorder migrations chronologically after they've been applied anywhere.

## Quick check

Before writing schema-changing code, run:

```powershell
Get-ChildItem -Recurse -Filter "*.sql" la-symphonie-electrique\src, la-symphonie-electrique\migrations -ErrorAction SilentlyContinue
```

to confirm the existing pattern.
