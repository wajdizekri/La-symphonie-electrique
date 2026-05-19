# Déploiement — VPS (SQLite, build standalone)

Stack : Next.js 16 (standalone) + better-sqlite3 (fichier local) + pm2 + Nginx/Caddy.
Hébergement type : OVH / Hetzner / Scaleway — Node 24, disque persistant.

## 0. Pré-requis serveur

```bash
# Node 24 + outils
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs build-essential sqlite3
sudo npm i -g pm2
```
`build-essential` est requis pour compiler le module natif better-sqlite3.

## 1. Code

```bash
sudo mkdir -p /var/www/symphonie && cd /var/www/symphonie
git clone <repo> .
npm ci
```

## 2. Variables d'environnement

Créer `/var/www/symphonie/.env.local` (voir `.env.example`). **À remplir réellement** :

- `JWT_SECRET` → `openssl rand -base64 48` (NE PAS réutiliser celui du dev)
- `NEXT_PUBLIC_BASE_URL=https://www.lasymphonieelectrique.fr`
- Stripe **live** : `STRIPE_SECRET_KEY=sk_live_…`, et `STRIPE_WEBHOOK_SECRET` = celui créé à l'étape 6
- `RESEND_API_KEY` + `RESEND_FROM_EMAIL` avec **domaine vérifié** chez Resend
- Twilio (compte payant) : SID / token / numéro
- Société : `NEXT_PUBLIC_COMPANY_*` (SIRET déjà OK, ajouter OWNER, PHONE, WHATSAPP, APE, TVA)
- (option) `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN`

## 3. Build

```bash
npm run build        # génère .next/standalone
```

⚠️ Le build standalone ne copie pas toujours le binaire natif de better-sqlite3.
Après le build, vérifier / copier si besoin :

```bash
cp -r node_modules/better-sqlite3 .next/standalone/node_modules/ 2>/dev/null || true
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
```

## 4. Base de données propre

```bash
# Repartir d'une base sans données de test (garde les vrais avis Google)
cp database.sqlite database.sqlite.bak   # si une base existe déjà
node scripts/reset-prod-db.mjs            # dry-run
node scripts/reset-prod-db.mjs --confirm  # exécute
```
La base se crée seule au 1er lancement si absente (schéma dans `src/lib/db.ts`).

## 5. Lancement avec pm2

```bash
cd /var/www/symphonie
NODE_ENV=production pm2 start ".next/standalone/server.js" --name symphonie --update-env
pm2 save
pm2 startup        # suivre l'instruction affichée (démarrage auto au boot)
```
Le serveur écoute sur `:3000` (variable `PORT` modifiable).

## 6. Webhook Stripe (prod)

Dashboard Stripe (mode **live**) → Developers → Webhooks → Add endpoint :
- URL : `https://www.lasymphonieelectrique.fr/api/webhooks/stripe`
- Évènement : `checkout.session.completed`
- Copier le `whsec_…` généré → le mettre dans `.env.local` (`STRIPE_WEBHOOK_SECRET`) → `pm2 restart symphonie --update-env`

## 7. Reverse proxy HTTPS — Caddy (le plus simple)

`/etc/caddy/Caddyfile` :
```
www.lasymphonieelectrique.fr, lasymphonieelectrique.fr {
    reverse_proxy localhost:3000
}
```
`sudo systemctl reload caddy` → HTTPS auto (Let's Encrypt). Pointer le DNS A/AAAA du domaine vers l'IP du VPS.

(Alternative Nginx : `proxy_pass http://localhost:3000;` + certbot pour le TLS.)

## 8. Premier admin

```bash
# 1. Aller sur https://.../admin/register et créer le compte
# 2. L'approuver :
cd /var/www/symphonie && node scripts/approve-admin.mjs ton-email@domaine.fr
```

## 9. Backups automatiques

```bash
chmod +x scripts/backup.sh
crontab -e
# Ajouter :
0 3 * * * APP_DIR=/var/www/symphonie BACKUP_DIR=/var/backups/symphonie /var/www/symphonie/scripts/backup.sh >> /var/log/symphonie-backup.log 2>&1
```
Idéalement, synchroniser `/var/backups/symphonie` vers un stockage externe (rsync/S3).

## 10. Mises à jour

```bash
cd /var/www/symphonie
git pull
npm ci
npm run build
cp -r public .next/standalone/public && cp -r .next/static .next/standalone/.next/static
pm2 restart symphonie --update-env
```

## Checklist go-live

- [ ] `.env.local` rempli avec les **vraies** valeurs (JWT fort, Stripe live, Resend domaine, Twilio payant, société)
- [ ] `npm run build` OK
- [ ] Base purgée des données de test (`reset-prod-db.mjs --confirm`)
- [ ] Webhook Stripe live configuré + secret en place
- [ ] HTTPS actif (Caddy/Nginx) + DNS pointé
- [ ] 1er admin créé et approuvé
- [ ] Cron de backup en place
- [ ] Test e2e : devis → acceptation → email/SMS reçus → facture → paiement réel → webhook → statut projet
