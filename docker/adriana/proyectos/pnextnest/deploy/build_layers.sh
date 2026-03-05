#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="${1:-$(cd "$SCRIPT_DIR/../../.." && pwd)}"

cd "$ROOT_DIR"

docker build -t adri/ubbase:latest -f ./dockerfiles/1ubbase/dockerfile .
docker build -t adri/security:latest -f ./dockerfiles/2security/dockerfile .
docker build -t adri/node:latest -f ./dockerfiles/6node/dockerfile .
docker build -t adri/next:latest -f ./dockerfiles/7next/dockerfile .
docker build -t adri/nest:latest -f ./dockerfiles/8nest/dockerfile .
docker build -t adri/postres:latest -f ./dockerfiles/9postres/dockerfile .

echo "Build de capas completado."
