# Deploy 04 - postgres

Requiere que exista la imagen `adri/security:latest` y la red compartida `red_adriana`.

```bash
docker network create red_adriana 2>/dev/null || true
cd ~/Proyecto_Adriana/docker/adriana/proyectos/deploy-tienda-online/deploy-04-postgres
docker compose up -d --build
docker compose ps
```
