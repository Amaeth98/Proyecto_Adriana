#!/bin/bash

# 1. EJECUTAMOS LA CAPA ANTERIOR
echo "[REACT] Ejecutando capa anterior (Nginx)..."
if [ -f /root/admin/nginx/start.sh ]; then
    bash /root/admin/nginx/start.sh
else
    echo "[REACT] ADVERTENCIA: No se encontró la capa Nginx."
fi

sleep 5

# 2. COMPILACIÓN Y ARRANQUE
echo "[REACT] Preparando entorno..."
mkdir -p /app/tarkov && cd /app/tarkov

# Instalamos dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "[REACT] Instalando node_modules..."
    npm install
fi

echo "[REACT] Compilando proyecto (npm run build)..."
npm run build

echo "[REACT] Iniciando Aplicación Vite en puerto 3000..."
npm run dev -- --host 0.0.0.0 --port 3000 &

# 3. MANTENEMOS VIVO
echo "=== TODO LISTO Y FUNCIONANDO (CAPA 04) ==="
tail -f /dev/null