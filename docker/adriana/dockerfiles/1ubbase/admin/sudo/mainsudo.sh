#!/bin/bash

configurar_sudo() {
  echo "Configurando sudo para ${USUARIO}..." >> /root/logs/informe.log

  # Validar usuario
  if [ -z "${USUARIO}" ]; then
    echo "ERROR: USUARIO está vacío. No se configura sudo." >> /root/logs/informe.log
    return 1
  fi

  # Asegurar que existe sudoers.d
  if [ -d /etc/sudoers.d ]; then
    SUDO_FILE="/etc/sudoers.d/${USUARIO}"

    echo "${USUARIO} ALL=(ALL) NOPASSWD:ALL" > "${SUDO_FILE}"
    chmod 0440 "${SUDO_FILE}"

    # (Opcional) validar sintaxis sudoers
    if command -v visudo >/dev/null 2>&1; then
      visudo -cf "${SUDO_FILE}" || {
        echo "ERROR: visudo detectó un fallo en ${SUDO_FILE}" >> /root/logs/informe.log
        rm -f "${SUDO_FILE}"
        return 1
      }
    fi

    echo "Sudo configurado en ${SUDO_FILE}" >> /root/logs/informe.log
  else
    echo "ERROR: /etc/sudoers.d no existe" >> /root/logs/informe.log
    return 1
  fi
}