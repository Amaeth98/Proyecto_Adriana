#!/bin/bash
set -e

# 1. EJECUTAMOS LA CAPA ANTERIOR (NGINX)
echo "[INICIO] Ejecutando capa anterior (Nginx)..."
if [ -f /root/admin/nginx/start.sh ]; then
  bash /root/admin/nginx/start.sh
else
  echo "[INICIO] ADVERTENCIA: No se encontró la capa Nginx."
fi

sleep 2

# 2. COMPILACIÓN Y ARRANQUE DEL PROYECTO INICIO
APP_DIR="/app/inicio"
PORT="${PORT:-3000}"

echo "[INICIO] Preparando entorno..."
cd "$APP_DIR"

# (Opcional) Si vas a montar volumen y puede faltar node_modules:
if [ ! -d "node_modules" ]; then
  echo "[INICIO] node_modules no existe. Instalando..."
  npm install
fi

echo "[INICIO] Compilando proyecto (npm run build)..."
npm run build

echo "[INICIO] Iniciando Vite en puerto ${PORT}..."
npm run dev -- --host 0.0.0.0 --port "$PORT" &

# Alternativa recomendada para contenedor final (sin HMR):
# npm run preview -- --host 0.0.0.0 --port "$PORT" &

echo "=== TODO LISTO Y FUNCIONANDO (CAPA 05 - INICIO) ==="
tail -f /dev/null