import 'dotenv/config';
import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { CartItem } from './cart/cart-item.entity';
import { Product } from './products/product.entity';
import { User } from './users/user.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'tienda_user',
  password: process.env.DB_PASSWORD ?? 'tienda_password',
  database: process.env.DB_NAME ?? 'tienda_online',
  entities: [User, Product, CartItem],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();
  const users = dataSource.getRepository(User);
  const products = dataSource.getRepository(Product);

  if (!(await users.existsBy({ email: 'admin@tienda.local' }))) {
    await users.save({
      name: 'Admin Fungi',
      email: 'admin@tienda.local',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
    });
  }

  if ((await products.count()) === 0) {
    await products.save([
      {
        name: 'Figura Amanita roja',
        description: 'Figura decorativa pintada a mano con sombrero rojo y puntos blancos.',
        price: '18.50',
        stock: 14,
        imageUrl: '/images/figura-amanita.svg',
      },
      {
        name: 'Setas bosque mini',
        description: 'Conjunto de tres figuras pequenas para estanterias, escritorios o terrarios decorativos.',
        price: '24.90',
        stock: 9,
        imageUrl: '/images/setas-bosque-mini.svg',
      },
      {
        name: 'Champinon ceramico',
        description: 'Pieza de ceramica esmaltada en tonos crema, pensada para decoracion artesanal.',
        price: '15.75',
        stock: 20,
        imageUrl: '/images/champinon-ceramico.svg',
      },
    ]);
  }

  await dataSource.destroy();
  console.log('Datos iniciales creados. Admin: admin@tienda.local / admin123');
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
