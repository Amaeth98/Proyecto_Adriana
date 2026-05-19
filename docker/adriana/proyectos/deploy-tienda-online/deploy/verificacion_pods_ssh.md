# Verificacion para video (Tienda Online, SSH, usuario y ciberseguridad)

## 1) Levantar el despliegue

```bash
cd ~/Proyecto_adriana/docker/adriana/proyectos/deploy-tienda-online/deploy
cd ../../..
docker build -t adri/ubbase:latest -f ./dockerfiles/01ubbase/dockerfile .
docker build -t adri/security:latest -f ./dockerfiles/02security/dockerfile .
docker build -t adri/node:latest -f ./dockerfiles/03node/dockerfile .
cd proyectos/deploy-tienda-online/deploy
docker compose up -d --build
docker compose ps
```

## 2) Probar HTTPS (no HTTP)

```bash
curl -k https://localhost:3443
curl -k https://localhost:3444/api/products
```

## 3) Entrar por SSH en cada pod/contenedor

```bash
ssh deploy@localhost -p 45681
ssh deploy@localhost -p 45680
ssh deploy@localhost -p 45679
```

## 4) Verificar usuario y autenticacion dentro de cada pod

```bash
whoami
id deploy
sudo -l
```

Resultado esperado:
- El usuario `deploy` existe.
- Tiene permisos sudo (NOPASSWD).
- Se entra por SSH con el usuario creado en la capa base.

## 5) Verificar ciberseguridad dentro de cada pod

```bash
ps aux | grep sshd
ss -tulnp
tail -n 20 /root/logs/informe.log
tail -n 20 /root/logs/audit_ports.log
```

Resultado esperado:
- `sshd` activo (autenticacion SSH).
- Existe `audit_ports.log` (auditoria de puertos en la capa de ciberseguridad).
- En `informe.log` aparece la ejecucion de capas Base/Security/Node/... segun la imagen.

## 6) Verificar PostgreSQL (imagen PostgreSQL)

Dentro del contenedor `ctl_04_postgres`:

```bash
su - postgres -c "psql -c '\du'"
su - postgres -c "psql -c '\l'"
```

Resultado esperado:
- Existe el rol `tienda_user`.
- Existe la base de datos `tienda_online`.

## 7) Crear datos iniciales de Tienda Online

```bash
docker compose exec s05_nest npm run seed -w apps/api
```

Resultado esperado:
- Existe el usuario admin `admin@tienda.local`.
- Existen productos iniciales de la tienda.
