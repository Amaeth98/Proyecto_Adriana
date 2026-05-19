import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { PayCartDto } from './dto/pay-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItem } from './cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepository: Repository<CartItem>,
    private readonly productsService: ProductsService,
  ) {}

  async getActiveCart(userId: number) {
    const items = await this.cartRepository.find({
      where: { userId, paymentDate: IsNull() },
      order: { id: 'ASC' },
    });

    const total = items.reduce(
      (sum, item) => sum + this.getItemPrice(item) * item.quantity,
      0,
    );

    return {
      items: items.map((item) =>
        Object.assign(item, {
        product: this.getItemProduct(item),
        subtotal: this.getItemPrice(item) * item.quantity,
        }),
      ),
      total,
    };
  }

  async addItem(userId: number, dto: AddCartItemDto) {
    const product = await this.productsService.findOne(dto.productId);
    if (dto.quantity > product.stock) {
      throw new BadRequestException('No hay stock suficiente');
    }

    const existing = await this.cartRepository.findOne({
      where: { userId, productId: dto.productId, paymentDate: IsNull() },
    });

    if (existing) {
      if (existing.quantity + dto.quantity > product.stock) {
        throw new BadRequestException('No hay stock suficiente');
      }
      existing.quantity += dto.quantity;
      return this.cartRepository.save(existing);
    }

    return this.cartRepository.save(
      this.cartRepository.create({
        userId,
        productId: dto.productId,
        productName: product.name,
        productPrice: product.price,
        quantity: dto.quantity,
      }),
    );
  }

  async updateItem(userId: number, itemId: number, dto: UpdateCartItemDto) {
    const item = await this.findActiveItem(userId, itemId);
    if (item.product && dto.quantity > item.product.stock) {
      throw new BadRequestException('No hay stock suficiente');
    }
    item.quantity = dto.quantity;
    return this.cartRepository.save(item);
  }

  async removeItem(userId: number, itemId: number) {
    const item = await this.findActiveItem(userId, itemId);
    await this.cartRepository.remove(item);
    return { deleted: true };
  }

  async getPayments(userId: number) {
    const items = await this.cartRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.product', 'product')
      .where('item.userId = :userId', { userId })
      .andWhere('item.paymentDate IS NOT NULL')
      .orderBy('item.paymentDate', 'DESC')
      .addOrderBy('item.id', 'ASC')
      .getMany();

    const payments = new Map<string, {
      paymentDate: Date;
      paymentMethod: string | null;
      items: Array<CartItem & { subtotal: number }>;
      total: number;
    }>();

    for (const item of items) {
      const key = item.paymentDate?.toISOString() ?? String(item.id);
      const subtotal = this.getItemPrice(item) * item.quantity;
      const payment = payments.get(key) ?? {
        paymentDate: item.paymentDate as Date,
        paymentMethod: item.paymentMethod ?? null,
        items: [],
        total: 0,
      };
      payment.items.push(Object.assign(item, { product: this.getItemProduct(item), subtotal }));
      payment.total += subtotal;
      payments.set(key, payment);
    }

    return Array.from(payments.values());
  }

  async pay(userId: number, dto: PayCartDto) {
    const cart = await this.getActiveCart(userId);
    if (!cart.items.length) throw new BadRequestException('El carrito esta vacio');

    const paymentDate = new Date();
    await Promise.all(
      cart.items.map((item) =>
        this.cartRepository.update(item.id, {
          paymentDate,
          paymentMethod: dto.method,
        }),
      ),
    );

    return {
      message: 'Pago realizado correctamente',
      paymentDate,
      paymentMethod: dto.method,
      total: cart.total,
    };
  }

  private async findActiveItem(userId: number, itemId: number) {
    const item = await this.cartRepository.findOne({
      where: { id: itemId, userId, paymentDate: IsNull() },
    });
    if (!item) throw new NotFoundException('Producto no encontrado en el carrito');
    return item;
  }

  private getItemPrice(item: CartItem) {
    return Number(item.product?.price ?? item.productPrice ?? 0);
  }

  private getItemProduct(item: CartItem) {
    return (
      item.product ?? {
        id: item.productId ?? 0,
        name: item.productName ?? 'Producto eliminado',
        description: '',
        price: item.productPrice ?? '0.00',
        stock: 0,
        imageUrl: undefined,
        cartItems: [],
      }
    );
  }
}
