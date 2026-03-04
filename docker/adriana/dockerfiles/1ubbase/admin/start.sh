#!/bin/bash
set -e

source /root/admin/base/mainuser.sh
source /root/admin/base/mainssh.sh
source /root/admin/base/mainsudo.sh

main () {
  mkdir -p /root/logs
  touch /root/logs/informe.log

  # Crear usuario
  crear_usuario

  # Configurar SSH
  configurar_ssh

  # Configurar sudo
  configurar_sudo

  echo "[BASE] Configuración base completada." >> /root/logs/informe.log

  # IMPORTANTE: no bloquear aquí (capa base debe devolver control)
  exit 0
}

main