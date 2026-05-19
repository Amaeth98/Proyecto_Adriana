import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '../products/product.module';
import { CartItem } from './cart-item.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem]), ProductModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
