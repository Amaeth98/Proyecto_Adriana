#!/bin/bash

comprobar_usuario(){
    if id "$USUARIO" >/dev/null 2>&1
    then
        echo "El usuario $USUARIO ya existe." >> /root/logs/informe.log
        return 0
    else
        echo "El usuario $USUARIO no existe. Creando usuario..." >> /root/logs/informe.log
        return 1
    fi
}

comprobar_directorio(){
    if [ ! -d "/home/$USUARIO" ]
    then
        echo "El directorio /home/$USUARIO no existe." >> /root/logs/informe.log
        return 1
    else
        echo "El directorio /home/$USUARIO ya existe." >> /root/logs/informe.log
        return 0
    fi
}

crear_usuario(){
    if [ -z "$USUARIO" ] || [ -z "$PASSWORD" ]; then
        echo "ERROR: USUARIO o PASSWORD estan vacios." >> /root/logs/informe.log
        return 1
    fi

    if comprobar_usuario
    then
        mkdir -p "/home/$USUARIO"
        echo "$USUARIO:$PASSWORD" | chpasswd
        echo "Bienvenido $USUARIO" > "/home/$USUARIO/welcome.txt"
        chown -R "$USUARIO:$USUARIO" "/home/$USUARIO"
        echo "Usuario $USUARIO ya preparado." >> /root/logs/informe.log
        return 0
    fi

    if comprobar_directorio
    then
        useradd -r -d "/home/$USUARIO" -s /bin/bash "$USUARIO"
    else
        useradd -rm -d "/home/$USUARIO" -s /bin/bash "$USUARIO"
    fi

    echo "$USUARIO:$PASSWORD" | chpasswd
    echo "Bienvenido $USUARIO" > "/home/$USUARIO/welcome.txt"
    chown -R "$USUARIO:$USUARIO" "/home/$USUARIO"
    echo "Usuario $USUARIO creado con exito." >> /root/logs/informe.log
    return 0
}
