#!/bin/bash
configurar_ssh() {
  mkdir -p /root/logs
  touch /root/logs/informe.log

  echo "Configurando SSH..." >> /root/logs/informe.log

  # Asegurar config
  if [ -f /etc/ssh/sshd_config ]; then
    # Port 3456 (cambia comentado o no comentado; si no existe, añade)
    if grep -qE '^\s*#?\s*Port\s+' /etc/ssh/sshd_config; then
      sed -i 's/^\s*#\?\s*Port\s\+.*/Port 3456/' /etc/ssh/sshd_config
    else
      echo "Port 3456" >> /etc/ssh/sshd_config
    fi

    # Disable root login
    if grep -qE '^\s*#?\s*PermitRootLogin\s+' /etc/ssh/sshd_config; then
      sed -i 's/^\s*#\?\s*PermitRootLogin\s\+.*/PermitRootLogin no/' /etc/ssh/sshd_config
    else
      echo "PermitRootLogin no" >> /etc/ssh/sshd_config
    fi
  fi

  # Crear directorios
  mkdir -p /run/sshd
  mkdir -p "/home/${USUARIO}/.ssh"

  # Añadir clave si existe
  if [ -f /root/admin/base/ssh/id_rsa.pub ]; then
    cat /root/admin/base/ssh/id_rsa.pub >> "/home/${USUARIO}/.ssh/authorized_keys"
    chown -R "${USUARIO}:${USUARIO}" "/home/${USUARIO}/.ssh"
    chmod 700 "/home/${USUARIO}/.ssh"
    chmod 600 "/home/${USUARIO}/.ssh/authorized_keys"
    echo "Clave SSH añadida" >> /root/logs/informe.log
  fi

  # Iniciar SSH en background (SIN exec)
  if command -v /usr/sbin/sshd >/dev/null 2>&1; then
    /usr/sbin/sshd -D &
    echo "SSH configurado y funcionando" >> /root/logs/informe.log
  else
    echo "ERROR: sshd no encontrado" >> /root/logs/informe.log
    return 1
  fi
}