#!/bin/bash
set -e

mkdir -p /root/logs
LOG="/root/logs/informe.log"
touch "$LOG"

echo "[POSTRES] Ejecutando capa anterior (Security)..." | tee -a "$LOG"
if [ -f /root/admin/security/start.sh ]; then
  bash /root/admin/security/start.sh
else
  echo "[POSTRES] ADVERTENCIA: No se encontro la capa Security." | tee -a "$LOG"
fi

PG_VERSION="$(ls /usr/lib/postgresql | sort -V | tail -n 1)"
if [ -z "$PG_VERSION" ]; then
  echo "[POSTRES] ERROR: No se detecto version de PostgreSQL instalada." | tee -a "$LOG"
  exit 1
fi

PG_APP_DB="${PG_APP_DB:-adriana_db}"
PG_APP_USER="${PG_APP_USER:-adriana}"
PG_APP_PASSWORD="${PG_APP_PASSWORD:-adriana_pwd}"
PG_APP_PASSWORD_SQL="$(printf "%s" "$PG_APP_PASSWORD" | sed "s/'/''/g")"

echo "[POSTRES] Inicializando cluster PostgreSQL ${PG_VERSION}..." | tee -a "$LOG"
pg_ctlcluster "$PG_VERSION" main start

DB_EXISTS="$(su - postgres -c "psql -tAc \"SELECT 1 FROM pg_database WHERE datname='${PG_APP_DB}'\"" | tr -d '[:space:]')"
ROLE_EXISTS="$(su - postgres -c "psql -tAc \"SELECT 1 FROM pg_roles WHERE rolname='${PG_APP_USER}'\"" | tr -d '[:space:]')"

if [ "$ROLE_EXISTS" != "1" ]; then
  echo "[POSTRES] Creando rol ${PG_APP_USER}..." | tee -a "$LOG"
  su - postgres -c "psql -v ON_ERROR_STOP=1 -c \"CREATE ROLE \\\"${PG_APP_USER}\\\" WITH LOGIN PASSWORD '${PG_APP_PASSWORD_SQL}';\""
else
  echo "[POSTRES] Rol ${PG_APP_USER} ya existe." | tee -a "$LOG"
fi

if [ "$DB_EXISTS" != "1" ]; then
  echo "[POSTRES] Creando base de datos ${PG_APP_DB}..." | tee -a "$LOG"
  su - postgres -c "createdb -O \"${PG_APP_USER}\" \"${PG_APP_DB}\""
else
  echo "[POSTRES] Base de datos ${PG_APP_DB} ya existe." | tee -a "$LOG"
fi

PG_CONF="/etc/postgresql/${PG_VERSION}/main/postgresql.conf"
PG_HBA="/etc/postgresql/${PG_VERSION}/main/pg_hba.conf"

if grep -qE "^[#]*\s*listen_addresses\s*=" "$PG_CONF"; then
  sed -i "s|^[#]*\s*listen_addresses\s*=.*|listen_addresses = '*'|g" "$PG_CONF"
else
  echo "listen_addresses = '*'" >> "$PG_CONF"
fi

grep -q "host all all 0.0.0.0/0 md5" "$PG_HBA" || echo "host all all 0.0.0.0/0 md5" >> "$PG_HBA"
grep -q "host all all ::/0 md5" "$PG_HBA" || echo "host all all ::/0 md5" >> "$PG_HBA"

echo "[POSTRES] Reiniciando PostgreSQL en foreground..." | tee -a "$LOG"
pg_ctlcluster "$PG_VERSION" main stop

PGDATA="/var/lib/postgresql/${PG_VERSION}/main"
exec su - postgres -c "/usr/lib/postgresql/${PG_VERSION}/bin/postgres -D '${PGDATA}' -c config_file='${PG_CONF}'"
