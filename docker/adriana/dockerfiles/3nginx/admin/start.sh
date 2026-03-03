#!/bin/bash

# 1. EJECUTAMOS LA CAPA ANTERIOR (Ciberseguridad)
echo "[NGINX] Ejecutando capa anterior (Security)..."
if [ -f /root/admin/security/start.sh ]; then
    bash /root/admin/security/start.sh
else
    echo "[NGINX] ADVERTENCIA: No se encontró la capa security."
fi

# 2. HACEMOS LO NUESTRO (Nginx)
echo "[NGINX] Iniciando Servidor Web..."
service nginx start

# (Nota: No ponemos tail -f aquí porque lo pondremos en la última capa si hace falta)