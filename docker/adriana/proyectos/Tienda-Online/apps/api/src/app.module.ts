import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { ProductModule } from './products/product.module';
import { UserModule } from './users/user.module';
import { CartItem } from './cart/cart-item.entity';
import { MemoryModule } from './memory/memory.module';
import { Product } from './products/product.entity';
import { User } from './users/user.entity';

const useMemoryDb = process.env.MEMORY_DB === 'true';
const isProduction = process.env.NODE_ENV === 'production';
const syncSchema = process.env.TYPEORM_SYNC === 'true' || !isProduction;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ...(useMemoryDb
      ? [MemoryModule]
      : [
          TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              type: 'postgres',
              host: config.get('DB_HOST', 'localhost'),
              port: config.get<number>('DB_PORT', 5432),
              username: config.get('DB_USER', 'tienda_user'),
              password: config.get('DB_PASSWORD', 'tienda_password'),
              database: config.get('DB_NAME', 'tienda_online'),
              entities: [User, Product, CartItem],
              synchronize: syncSchema,
            }),
          }),
          AuthModule,
          UserModule,
          ProductModule,
          CartModule,
        ]),
  ],
})
export class AppModule {}
