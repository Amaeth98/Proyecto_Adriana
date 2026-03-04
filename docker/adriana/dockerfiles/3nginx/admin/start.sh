#!/bin/bash
set -e

mkdir -p /root/logs
touch /root/logs/informe.log
LOG="/root/logs/informe.log"

echo "[NGINX] Ejecutando capa anterior (Security)..." | tee -a "$LOG"

if [ -f /root/admin/security/start.sh ]; then
    bash /root/admin/security/start.sh
else
    echo "[NGINX] ADVERTENCIA: No se encontró la capa Security." | tee -a "$LOG"
fi

echo "[NGINX] Preparando servidor web..." | tee -a "$LOG"

if ! command -v nginx >/dev/null 2>&1; then
    echo "[NGINX] ERROR: nginx no está instalado." | tee -a "$LOG"
    exit 1
fi

# Arrancar nginx en background (capa intermedia)
echo "[NGINX] Iniciando Servidor Web..." | tee -a "$LOG"
nginx -g "daemon off;" &
echo "[NGINX] Nginx arrancado en background." | tee -a "$LOG"

# IMPORTANTE: no bloquear aquí, devolver control a la capa superior
exit 0