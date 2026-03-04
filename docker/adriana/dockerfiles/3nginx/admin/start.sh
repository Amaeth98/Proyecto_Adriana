#!/bin/bash

LOG="/root/logs/informe.log"

echo "[NGINX] Ejecutando capa anterior (Security)..." | tee -a $LOG

# Ejecutar capa anterior si existe
if [ -f /root/admin/security/start.sh ]; then
    bash /root/admin/security/start.sh
else
    echo "[NGINX] ADVERTENCIA: No se encontró la capa Security." | tee -a $LOG
fi

sleep 2

echo "[NGINX] Preparando servidor web..." | tee -a $LOG

# Comprobar si nginx está instalado
if ! command -v nginx >/dev/null 2>&1; then
    echo "[NGINX] ERROR: nginx no está instalado." | tee -a $LOG
    exit 1
fi

# Crear directorio logs si no existe
mkdir -p /root/logs

echo "[NGINX] Iniciando Servidor Web..." | tee -a $LOG

# Arrancar nginx en primer plano (requerido para Docker)
exec nginx -g "daemon off;"