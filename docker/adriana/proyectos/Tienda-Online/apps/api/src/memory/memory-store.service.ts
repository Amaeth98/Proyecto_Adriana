import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '../users/user.entity';

type MemoryUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

type MemoryProduct = {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl?: string;
};

type MemoryCartItem = {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  paymentDate?: Date | null;
  paymentMethod?: string | null;
};

@Injectable()
export class MemoryStoreService {
  private userId = 2;
  private productId = 4;
  private cartItemId = 1;

  users: MemoryUser[] = [
    {
      id: 1,
      name: 'Admin Fungi',
      email: 'admin@tienda.local',
      password: 'admin123',
      role: 'admin',
    },
  ];

  products: MemoryProduct[] = [
    {
      id: 1,
      name: 'Figura Amanita roja',
      description: 'Figura decorativa pintada a mano con sombrero rojo y puntos blancos.',
      price: '18.50',
      stock: 14,
      imageUrl: '/images/figura-amanita.svg',
    },
    {
      id: 2,
      name: 'Setas bosque mini',
      description: 'Conjunto de tres figuras pequenas para estanterias, escritorios o terrarios decorativos.',
      price: '24.90',
      stock: 9,
      imageUrl: '/images/setas-bosque-mini.svg',
    },
    {
      id: 3,
      name: 'Champinon ceramico',
      description: 'Pieza de ceramica esmaltada en tonos crema, pensada para decoracion artesanal.',
      price: '15.75',
      stock: 20,
      imageUrl: '/images/champinon-ceramico.svg',
    },
  ];

  cartItems: MemoryCartItem[] = [];

  nextUserId() {
    return this.userId++;
  }

  nextProductId() {
    return this.productId++;
  }

  nextCartItemId() {
    return this.cartItemId++;
  }

  getProduct(id: number) {
    const product = this.products.find((item) => item.id === id);
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }
}
