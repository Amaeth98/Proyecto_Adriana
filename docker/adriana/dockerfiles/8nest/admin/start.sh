#!/bin/bash
set -e

mkdir -p /root/logs
LOG="/root/logs/informe.log"
touch "$LOG"

echo "[NEST] Ejecutando capa anterior (Node)..." | tee -a "$LOG"
if [ -f /root/admin/node/start.sh ]; then
  bash /root/admin/node/start.sh
else
  echo "[NEST] ADVERTENCIA: No se encontro la capa Node." | tee -a "$LOG"
fi

APP_DIR="/app/api-pelis-pokemon"
cd "$APP_DIR"

if [ ! -d node_modules ]; then
  echo "[NEST] Instalando dependencias..." | tee -a "$LOG"
  npm install
fi

if [ ! -f dist/main.js ]; then
  echo "[NEST] Compilando API..." | tee -a "$LOG"
  npm run build
fi

PORT="${PORT:-3444}"
NEST_SSL="${NEST_SSL:-true}"
SSL_KEY_PATH="${SSL_KEY_PATH:-/etc/ssl/private/nest.key}"
SSL_CERT_PATH="${SSL_CERT_PATH:-/etc/ssl/certs/nest.crt}"
SSL_SUBJECT="${SSL_SUBJECT:-/CN=localhost}"

if [ "$NEST_SSL" = "true" ]; then
  if [ ! -f "$SSL_KEY_PATH" ] || [ ! -f "$SSL_CERT_PATH" ]; then
    echo "[NEST] Generando certificado TLS autofirmado..." | tee -a "$LOG"
    mkdir -p "$(dirname "$SSL_KEY_PATH")" "$(dirname "$SSL_CERT_PATH")"
    openssl req -x509 -nodes -newkey rsa:2048 \
      -keyout "$SSL_KEY_PATH" \
      -out "$SSL_CERT_PATH" \
      -subj "$SSL_SUBJECT" \
      -days 365 >/dev/null 2>&1
    chmod 600 "$SSL_KEY_PATH"
    chmod 644 "$SSL_CERT_PATH"
  fi
fi

export PORT
export NEST_SSL
export SSL_KEY_PATH
export SSL_CERT_PATH

echo "[NEST] Arrancando API en HTTPS por 0.0.0.0:${PORT}..." | tee -a "$LOG"
exec npm run start:prod
