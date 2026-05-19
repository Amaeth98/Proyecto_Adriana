# Fungi Decor

Este es mi proyecto final de IAW. Es una tienda online de figuras decorativas de setas, hecha con una parte frontend y otra backend.

La idea era crear una aplicacion completa donde un usuario pueda ver productos, registrarse, iniciar sesion, anadir productos al carrito y simular una compra. Tambien hay una parte de administrador para gestionar productos y usuarios.

Para el proyecto he usado:

- Next.js para la parte visual.
- NestJS para la API.
- TypeORM para trabajar con las entidades.
- PostgreSQL como base de datos.
- JWT para el login y las rutas protegidas.

## Estructura

El proyecto esta dividido en dos carpetas principales:

- `apps/web`: aqui esta el frontend con las paginas de inicio, productos, login, registro, carrito, ajustes, gestion de productos y usuarios.
- `apps/api`: aqui esta el backend con los modulos de productos, usuarios, autenticacion y carrito.

La raiz del proyecto tiene los scripts generales para poder arrancar las dos partes a la vez.

## Base de datos PostgreSQL

Para usar el proyecto con PostgreSQL hay que crear una base de datos con estos datos, o cambiar las variables en `apps/api/.env`:

- Base de datos: `tienda_online`
- Usuario: `tienda_user`
- Password: `tienda_password`
- Puerto: `5432`

## Instalacion

Primero se instalan las dependencias:

```bash
npm install
```

Despues se crean los archivos de entorno a partir de los ejemplos:

```bash
copy apps\api\.env.example apps\api\.env
copy apps\web\.env.example apps\web\.env.local
```

En PowerShell puede salir un error con las politicas de ejecucion de `npm.ps1`. Si pasa eso, se puede usar `npm.cmd`:

```bash
npm.cmd install
npm.cmd run dev
```

Si se usa PostgreSQL, despues de tener la base de datos levantada se pueden crear datos iniciales con:

```bash
npm run seed:dev -w apps/api
```

Usuario admin de prueba:

- Email: `admin@tienda.local`
- Password: `admin123`

## Arranque

Para arrancar frontend y backend a la vez:

```bash
npm run dev
```

Las URLs son:

- Frontend: `http://localhost:3000`
- Backend/API: `http://localhost:3001/api`

## Modo local sin base de datos

Tambien he dejado un modo local sin base de datos para poder probar la aplicacion mas facilmente. Para activarlo, en `apps/api/.env` hay que poner:

```bash
MEMORY_DB=true
```

En este modo se guardan productos, usuarios y carrito en memoria. Sirve para probar la web rapido, pero cuando se cierra el backend se pierden los datos.

## Endpoints principales

Algunas rutas importantes de la API son:

- `GET /api/products`: lista los productos.
- `GET /api/products?query=texto`: busca productos.
- `GET /api/products/:id`: muestra el detalle de un producto.
- `POST /api/auth/login`: inicia sesion y devuelve un token JWT.
- `POST /api/auth/register`: registra un usuario.
- `POST /api/users`: crea un usuario con perfil normal.
- `GET /api/users/profile`: devuelve los datos del usuario autenticado.
- `GET /api/cart`: muestra el carrito activo.
- `POST /api/cart/items`: anade un producto al carrito.
- `PATCH /api/cart/items/:id`: cambia la cantidad de un producto del carrito.
- `DELETE /api/cart/items/:id`: elimina una linea del carrito.
- `POST /api/cart/pay`: simula el pago del carrito.

## Relacion N:N

La tabla `cart_items` representa la relacion entre usuarios y productos. No es solo una tabla intermedia simple, porque tambien guarda datos propios de la compra:

- `quantity`
- `paymentDate`
- `paymentMethod`
- fechas de creacion/actualizacion

Mientras `paymentDate` es `NULL`, el producto sigue apareciendo en el carrito activo. Cuando el usuario paga, se guarda la fecha de pago y deja de aparecer como carrito pendiente.

## Funciones principales

La aplicacion permite:

- Ver productos de la tienda.
- Buscar productos.
- Ver el detalle de cada producto.
- Registrarse e iniciar sesion.
- Anadir productos al carrito.
- Cambiar cantidades o eliminar productos del carrito.
- Simular un pago.
- Editar el perfil del usuario.
- Gestionar productos como administrador.
- Ver y gestionar usuarios como administrador.
