#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="${1:-$(cd "$SCRIPT_DIR/../../.." && pwd)}"

cd "$ROOT_DIR"

if [ -d "$ROOT_DIR/proyectos" ]; then
  PROJECTS_DIR="proyectos"
elif [ -d "$ROOT_DIR/proyecto" ]; then
  PROJECTS_DIR="proyecto"
else
  echo "ERROR: No existe ni '$ROOT_DIR/proyectos' ni '$ROOT_DIR/proyecto'."
  exit 1
fi

echo "Usando directorio de proyectos: $PROJECTS_DIR"

# Compatibilidad: crea alias entre proyecto/proyectos para evitar fallos en COPY.
if [ "$PROJECTS_DIR" = "proyecto" ] && [ ! -e "$ROOT_DIR/proyectos" ]; then
  ln -s proyecto "$ROOT_DIR/proyectos"
fi
if [ "$PROJECTS_DIR" = "proyectos" ] && [ ! -e "$ROOT_DIR/proyecto" ]; then
  ln -s proyectos "$ROOT_DIR/proyecto"
fi

docker build -t adri/ubbase:latest -f ./dockerfiles/1ubbase/dockerfile .
docker build -t adri/security:latest -f ./dockerfiles/2security/dockerfile .
docker build -t adri/node:latest -f ./dockerfiles/6node/dockerfile .
docker build --build-arg PROJECTS_DIR="$PROJECTS_DIR" -t adri/next:latest -f ./dockerfiles/7next/dockerfile .
docker build --build-arg PROJECTS_DIR="$PROJECTS_DIR" -t adri/nest:latest -f ./dockerfiles/8nest/dockerfile .
docker build -t adri/postres:latest -f ./dockerfiles/9postres/dockerfile .

echo "Build de capas completado."
