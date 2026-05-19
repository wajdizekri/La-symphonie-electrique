#!/usr/bin/env bash
# Sauvegarde quotidienne de la base SQLite + des uploads.
# À mettre en cron sur le VPS :
#   0 3 * * *  /var/www/symphonie/scripts/backup.sh >> /var/log/symphonie-backup.log 2>&1
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/symphonie}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/symphonie}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
STAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$BACKUP_DIR"

# Backup cohérent de SQLite (sqlite3 .backup, sûr même si l'app écrit)
if command -v sqlite3 >/dev/null 2>&1; then
  sqlite3 "$APP_DIR/database.sqlite" ".backup '$BACKUP_DIR/db-$STAMP.sqlite'"
else
  cp "$APP_DIR/database.sqlite" "$BACKUP_DIR/db-$STAMP.sqlite"
fi

# Uploads (photos clients)
if [ -d "$APP_DIR/public/uploads" ]; then
  tar -czf "$BACKUP_DIR/uploads-$STAMP.tar.gz" -C "$APP_DIR/public" uploads
fi

# Purge des sauvegardes plus vieilles que RETENTION_DAYS
find "$BACKUP_DIR" -type f -mtime "+$RETENTION_DAYS" -delete

echo "[$(date)] Backup OK → $BACKUP_DIR (db-$STAMP.sqlite)"
