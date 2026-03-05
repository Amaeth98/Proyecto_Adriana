#!/bin/bash
set -e

mkdir -p /root/logs
LOG="/root/logs/informe.log"
touch "$LOG"

echo "[NEXT] Ejecutando capa anterior (Node)..." | tee -a "$LOG"
if [ -f /root/admin/node/start.sh ]; then
  bash /root/admin/node/start.sh
else
  echo "[NEXT] ADVERTENCIA: No se encontro la capa Node." | tee -a "$LOG"
fi

APP_DIR="/app/pokeapi-adriana"
cd "$APP_DIR"

if [ ! -d node_modules ]; then
  echo "[NEXT] Instalando dependencias..." | tee -a "$LOG"
  npm install
fi

if [ ! -f .next/BUILD_ID ]; then
  echo "[NEXT] Compilando aplicacion..." | tee -a "$LOG"
  npm run build
fi

NEXT_PORT="${NEXT_PORT:-3443}"
SSL_KEY_PATH="${SSL_KEY_PATH:-/etc/ssl/private/next.key}"
SSL_CERT_PATH="${SSL_CERT_PATH:-/etc/ssl/certs/next.crt}"
SSL_SUBJECT="${SSL_SUBJECT:-/CN=localhost}"

if [ ! -f "$SSL_KEY_PATH" ] || [ ! -f "$SSL_CERT_PATH" ]; then
  echo "[NEXT] Generando certificado TLS autofirmado..." | tee -a "$LOG"
  mkdir -p "$(dirname "$SSL_KEY_PATH")" "$(dirname "$SSL_CERT_PATH")"
  openssl req -x509 -nodes -newkey rsa:2048 \
    -keyout "$SSL_KEY_PATH" \
    -out "$SSL_CERT_PATH" \
    -subj "$SSL_SUBJECT" \
    -days 365 >/dev/null 2>&1
  chmod 600 "$SSL_KEY_PATH"
  chmod 644 "$SSL_CERT_PATH"
fi

export NEXT_PORT
export SSL_KEY_PATH
export SSL_CERT_PATH

echo "[NEXT] Arrancando Next.js en HTTPS por 0.0.0.0:${NEXT_PORT}..." | tee -a "$LOG"
exec node /root/admin/next/https-server.mjs
