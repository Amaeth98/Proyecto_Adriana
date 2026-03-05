# Verificacion para video (SSH, usuario y ciberseguridad)

## 1) Levantar el despliegue

```bash
cd ~/Proyecto_adriana/docker/adriana/proyectos/pnextnest/deploy
cd ../../..
docker build -t adri/ubbase:latest -f ./dockerfiles/1ubbase/dockerfile .
docker build -t adri/security:latest -f ./dockerfiles/2security/dockerfile .
docker build -t adri/node:latest -f ./dockerfiles/6node/dockerfile .
cd proyectos/pnextnest/deploy
docker compose up -d --build
docker compose ps
```

## 2) Probar HTTPS (no HTTP)

```bash
curl -k https://localhost:3443
curl -k https://localhost:3444
```

## 3) Entrar por SSH en cada pod/contenedor

```bash
ssh adriana@localhost -p 45679
ssh adriana@localhost -p 45680
ssh adriana@localhost -p 45681
```

## 4) Verificar usuario y autenticacion dentro de cada pod

```bash
whoami
id adriana
sudo -l
```

Resultado esperado:
- El usuario `adriana` existe.
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

## 6) Verificar PostgreSQL (imagen Postres)

Dentro del contenedor `ctl_postres`:

```bash
su - postgres -c "psql -c '\du'"
su - postgres -c "psql -c '\l'"
```

Resultado esperado:
- Existe el rol `adriana_pg`.
- Existe la base de datos `nest_pelis_pokemon`.
