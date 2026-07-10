#!/usr/bin/env bash
# Déploiement La Symphonie Électrique sur VPS Ubuntu 24.04.
# Idempotent : relançable sans casse. Usage :
#   curl -fsSL https://raw.githubusercontent.com/wajdizekri/La-symphonie-electrique/main/deploy.sh | bash
set -euo pipefail

REPO="https://github.com/wajdizekri/La-symphonie-electrique.git"
APP_DIR="/var/www/symphonie"

echo "==> 1/6 Socle système (Node 24, outils, pm2)"
if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -d. -f1)" != "v24" ]; then
  curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
sudo apt-get install -y build-essential sqlite3 git
sudo npm i -g pm2

echo "==> 2/6 Récupération du code"
sudo mkdir -p "$APP_DIR"
sudo chown -R "$USER:$USER" "$APP_DIR"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" fetch origin main
  git -C "$APP_DIR" reset --hard origin/main
else
  sudo rm -rf "${APP_DIR:?}/"* "${APP_DIR:?}/".[!.]* 2>/dev/null || true
  git clone "$REPO" "$APP_DIR"
fi
cd "$APP_DIR"
npm ci

echo "==> 3/6 Configuration (.env.local)"
if [ ! -f .env.local ]; then
  cat > .env.local <<EOF
JWT_SECRET=$(openssl rand -base64 48)
NEXT_PUBLIC_BASE_URL=https://lasymphonieelectrique.fr
NEXT_PUBLIC_COMPANY_LEGAL_FORM="Entrepreneur Individuel"
NEXT_PUBLIC_COMPANY_EMAIL=contact@lasymphonieelectrique.fr
NEXT_PUBLIC_COMPANY_ADDRESS="74300 Cluses, Haute-Savoie"
NEXT_PUBLIC_COMPANY_CITY=Cluses
NEXT_PUBLIC_COMPANY_POSTAL=74300
EOF
  echo "    .env.local créé (JWT_SECRET généré automatiquement)."
else
  echo "    .env.local déjà présent → conservé."
fi

echo "==> 4/6 Build de production"
npm run build
cp -r node_modules/better-sqlite3 .next/standalone/node_modules/ 2>/dev/null || true
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
# Base unique : standalone pointe vers la base racine (le build régénère standalone et efface le lien)
ln -sf "$(pwd)/database.sqlite" .next/standalone/database.sqlite

echo "==> 5/6 Démarrage avec pm2"
export JWT_SECRET="$(grep -E '^JWT_SECRET=' .env.local | cut -d= -f2-)"
export NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
pm2 delete symphonie >/dev/null 2>&1 || true
pm2 start .next/standalone/server.js --name symphonie --update-env
pm2 save

echo "==> 6/6 Démarrage automatique au reboot"
sudo env PATH="$PATH:$(dirname "$(which node)")" "$(which pm2)" startup systemd -u "$USER" --hp "$HOME" >/dev/null 2>&1 || true
pm2 save

echo ""
echo "======================================================"
echo " Déploiement terminé."
echo " Test : http://51.255.165.54:3000"
echo "======================================================"
