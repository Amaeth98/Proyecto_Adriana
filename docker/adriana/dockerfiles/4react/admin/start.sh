#!/bin/bash
set -e

# Asegurar carpeta de logs (evita: tee: /root/logs/informe.log: No such file or directory)
mkdir -p /root/logs
touch /root/logs/informe.log

# 1. EJECUTAMOS LA CAPA ANTERIOR
echo "[REACT] Ejecutando capa anterior (Nginx)..."
if [ -f /root/admin/nginx/start.sh ]; then
    bash /root/admin/nginx/start.sh
else
    echo "[REACT] ADVERTENCIA: No se encontró la capa Nginx." | tee -a /root/logs/informe.log
fi

sleep 2

# 2. COMPILACIÓN Y ARRANQUE
echo "[REACT] Preparando entorno..." | tee -a /root/logs/informe.log
mkdir -p /app/webbasica
cd /app/webbasica

# Instalamos dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "[REACT] Instalando node_modules..." | tee -a /root/logs/informe.log
    npm install
fi

echo "[REACT] Compilando proyecto (npm run build)..." | tee -a /root/logs/informe.log
npm run build

echo "[REACT] Iniciando Aplicación Vite en puerto 3000..." | tee -a /root/logs/informe.log
npm run dev -- --host 0.0.0.0 --port 3000 &

# 3. MANTENEMOS VIVO
echo "=== TODO LISTO Y FUNCIONANDO (CAPA 04) ===" | tee -a /root/logs/informe.log
tail -f /dev/null