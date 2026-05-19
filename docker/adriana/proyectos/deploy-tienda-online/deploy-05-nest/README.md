# Deploy 05 - nest

Requiere que existan `adri/node:latest`, PostgreSQL levantado y la red compartida `red_adriana`.

```bash
cd ~/Proyecto_Adriana/docker/adriana/proyectos/deploy-tienda-online/deploy-05-nest
docker compose up -d --build
docker compose ps
```
