#!/bin/bash

source /root/admin/base/mainuser.sh
source /root/admin/base/mainssh.sh
source /root/admin/base/mainsudo.sh

main (){

    mkdir -p /root/logs
    touch /root/logs/informe.log
    # Crear usuario
    crear_usuario
    # Configurar SSH
    configurar_ssh
    # Configurar sudo
    configurar_sudo
    # Mantener el contenedor en ejecución
    #tail -f /dev/null
}

main