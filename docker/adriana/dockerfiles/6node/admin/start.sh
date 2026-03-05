#!/bin/bash
set -e

mkdir -p /root/logs
LOG="/root/logs/informe.log"
touch "$LOG"

echo "[NODE] Ejecutando capa anterior (Security)..." | tee -a "$LOG"
if [ -f /root/admin/security/start.sh ]; then
  bash /root/admin/security/start.sh
else
  echo "[NODE] ADVERTENCIA: No se encontro la capa Security." | tee -a "$LOG"
fi

if ! command -v node >/dev/null 2>&1; then
  echo "[NODE] ERROR: node no esta instalado." | tee -a "$LOG"
  exit 1
fi

echo "[NODE] Versiones detectadas: node $(node -v), npm $(npm -v)." | tee -a "$LOG"
echo "[NODE] Capa Node lista para la imagen superior." | tee -a "$LOG"
exit 0
