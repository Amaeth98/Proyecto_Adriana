#!/bin/bash

# 1. EJECUTAR CAPA ANTERIOR (Base)
echo "[CIBER] Ejecutando capa anterior (Base)..."
if [ -f /root/admin/base/start.sh ]; then
    bash /root/admin/base/start.sh
else
    echo "[CIBER] ADVERTENCIA: No se encontró la capa base."
fi

# Función para iniciar auditoría en background
start_audit(){
    LOG_DIR="/root/logs"
    mkdir -p $LOG_DIR
    LOG_FILE="$LOG_DIR/audit_ports.log"
    
    echo "[CIBER] Iniciando auditoria en $LOG_FILE..."
    
    # Bucle infinito en segundo plano
    while true; do
        echo "=== AUDIT $(date) ===" >> "$LOG_FILE"
        ss -tulnp >> "$LOG_FILE" 2>&1
        echo "" >> "$LOG_FILE"
        sleep 30
    done &
}

# 2. Iniciamos SSH
echo "[CIBER] Iniciando servicio SSH..."
/usr/sbin/sshd

# 3. Iniciamos Auditoría
start_audit