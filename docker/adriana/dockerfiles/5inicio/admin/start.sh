#!/bin/bash
set -e

mkdir -p /root/logs
LOG="/root/logs/informe.log"
touch "$LOG"

echo "[INICIO] Ejecutando capa anterior (Nginx)..." | tee -a "$LOG"
if [ -f /root/admin/nginx/start.sh ]; then
  bash /root/admin/nginx/start.sh
else
  echo "[INICIO] ADVERTENCIA: No se encontro la capa Nginx." | tee -a "$LOG"
fi

APP_DIR="/app/inicio"
echo "[INICIO] Preparando entorno en $APP_DIR ..." | tee -a "$LOG"
cd "$APP_DIR"

if [ ! -d node_modules ]; then
  echo "[INICIO] Instalando dependencias..." | tee -a "$LOG"
  npm install
fi

echo "[INICIO] Arrancando Vite en 3000 ..." | tee -a "$LOG"
exec npm run dev -- --host 0.0.0.0 --port 3000
