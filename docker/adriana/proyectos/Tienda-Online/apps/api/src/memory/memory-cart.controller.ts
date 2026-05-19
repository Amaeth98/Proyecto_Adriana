import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/jwt-payload';
import { AddCartItemDto } from '../cart/dto/add-cart-item.dto';
import { PayCartDto } from '../cart/dto/pay-cart.dto';
import { UpdateCartItemDto } from '../cart/dto/update-cart-item.dto';
import { MemoryStoreService } from './memory-store.service';

type MemoryPayment = {
  paymentDate: Date;
  paymentMethod: string | null;
  items: Array<{
    id: number;
    userId: number;
    productId: number;
    quantity: number;
    paymentDate?: Date | null;
    paymentMethod?: string | null;
    product: ReturnType<MemoryStoreService['getProduct']>;
    subtotal: number;
  }>;
  total: number;
};

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class MemoryCartController {
  constructor(private readonly store: MemoryStoreService) {}

  @Get()
  getCart(@CurrentUser() user: JwtPayload) {
    const items = this.store.cartItems
      .filter((item) => item.userId === user.sub && !item.paymentDate)
      .map((item) => {
        const product = this.store.getProduct(item.productId);
        return {
          ...item,
          product,
          subtotal: Number(product.price) * item.quantity,
        };
      });

    return {
      items,
      total: items.reduce((sum, item) => sum + item.subtotal, 0),
    };
  }

  @Get('payments')
  getPayments(@CurrentUser() user: JwtPayload) {
    const payments = new Map<string, MemoryPayment>();

    this.store.cartItems
      .filter((item) => item.userId === user.sub && item.paymentDate)
      .forEach((item) => {
        const product = this.store.getProduct(item.productId);
        const subtotal = Number(product.price) * item.quantity;
        const key = item.paymentDate?.toISOString() ?? String(item.id);
        const payment = payments.get(key) ?? {
          paymentDate: item.paymentDate as Date,
          paymentMethod: item.paymentMethod ?? null,
          items: [],
          total: 0,
        };
        payment.items.push({ ...item, product, subtotal });
        payment.total += subtotal;
        payments.set(key, payment);
      });

    return Array.from(payments.values()).sort(
      (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(),
    );
  }

  @Post('items')
  addItem(@CurrentUser() user: JwtPayload, @Body() dto: AddCartItemDto) {
    this.store.getProduct(dto.productId);
    const existing = this.store.cartItems.find(
      (item) =>
        item.userId === user.sub &&
        item.productId === dto.productId &&
        !item.paymentDate,
    );

    if (existing) {
      existing.quantity += dto.quantity;
      return existing;
    }

    const item = {
      id: this.store.nextCartItemId(),
      userId: user.sub,
      productId: dto.productId,
      quantity: dto.quantity,
      paymentDate: null,
    };
    this.store.cartItems.push(item);
    return item;
  }

  @Patch('items/:id')
  updateItem(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    const item = this.store.cartItems.find(
      (cartItem) => cartItem.id === id && cartItem.userId === user.sub,
    );
    if (!item) return null;
    item.quantity = dto.quantity;
    return item;
  }

  @Delete('items/:id')
  removeItem(@CurrentUser() user: JwtPayload, @Param('id', ParseIntPipe) id: number) {
    this.store.cartItems = this.store.cartItems.filter(
      (item) => !(item.id === id && item.userId === user.sub),
    );
    return { deleted: true };
  }

  @Post('pay')
  pay(@CurrentUser() user: JwtPayload, @Body() dto: PayCartDto) {
    const cart = this.getCart(user);
    const paymentDate = new Date();
    this.store.cartItems
      .filter((item) => item.userId === user.sub && !item.paymentDate)
      .forEach((item) => {
        item.paymentDate = paymentDate;
        item.paymentMethod = dto.method;
      });
    return {
      message: 'Pago realizado correctamente',
      paymentDate,
      paymentMethod: dto.method,
      total: cart.total,
    };
  }
}
