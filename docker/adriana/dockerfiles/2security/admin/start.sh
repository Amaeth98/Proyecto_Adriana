#!/bin/bash
set -e

mkdir -p /root/logs
touch /root/logs/informe.log

# 1. EJECUTAR CAPA ANTERIOR (Base)
echo "[CIBER] Ejecutando capa anterior (Base)..." | tee -a /root/logs/informe.log
if [ -f /root/admin/base/start.sh ]; then
    bash /root/admin/base/start.sh
else
    echo "[CIBER] ADVERTENCIA: No se encontró la capa base." | tee -a /root/logs/informe.log
fi

# Función para iniciar auditoría en background
start_audit() {
    LOG_DIR="/root/logs"
    mkdir -p "$LOG_DIR"
    LOG_FILE="$LOG_DIR/audit_ports.log"

    echo "[CIBER] Iniciando auditoria en $LOG_FILE..." | tee -a /root/logs/informe.log

    while true; do
        echo "=== AUDIT $(date) ===" >> "$LOG_FILE"
        ss -tulnp >> "$LOG_FILE" 2>&1
        echo "" >> "$LOG_FILE"
        sleep 30
    done &
}

# 2. Iniciamos SSH (solo si no está ya)
if ! pgrep -x sshd >/dev/null 2>&1; then
    echo "[CIBER] Iniciando servicio SSH..." | tee -a /root/logs/informe.log
    /usr/sbin/sshd -D &
else
    echo "[CIBER] SSH ya estaba arrancado." | tee -a /root/logs/informe.log
fi

# 3. Iniciamos Auditoría
start_audit

echo "[CIBER] Capa Security finalizada (servicios en background)." | tee -a /root/logs/informe.log
exit 0