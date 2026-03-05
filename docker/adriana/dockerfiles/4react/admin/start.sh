#!/bin/bash
set -e

mkdir -p /root/logs
touch /root/logs/informe.log
LOG="/root/logs/informe.log"

echo "[REACT] Ejecutando capa anterior (Nginx)..." | tee -a "$LOG"
if [ -f /root/admin/nginx/start.sh ]; then
  bash /root/admin/nginx/start.sh
else
  echo "[REACT] ADVERTENCIA: No se encontró la capa Nginx." | tee -a "$LOG"
fi

APP_DIR="/app/inicio"
echo "[REACT] Preparando entorno en ${APP_DIR}..." | tee -a "$LOG"
cd "$APP_DIR"

# Normalmente ya está instalado en build, pero por si acaso
if [ ! -d "node_modules" ]; then
  echo "[REACT] Instalando dependencias..." | tee -a "$LOG"
  npm install
fi

echo "[REACT] Compilando (npm run build)..." | tee -a "$LOG"
npm run build

echo "[REACT] Capa React finalizada (sin arrancar Vite, lo hará 5inicio)." | tee -a "$LOG"
exit 0