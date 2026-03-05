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

if [ ! -d "node_modules" ]; then
    echo "[REACT] Instalando dependencias..." | tee -a "$LOG"
    npm install
fi

echo "[REACT] Compilando (npm run build)..." | tee -a "$LOG"
npm run build

echo "[REACT] Arrancando Vite en foreground (puerto 3000)..." | tee -a /root/logs/informe.log
exec npm run dev -- --host 0.0.0.0 --port 3000