import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt.strategy';
import { RolesGuard } from '../auth/roles.guard';
import { getRequiredConfig } from '../config';
import { MemoryAuthController } from './memory-auth.controller';
import { MemoryCartController } from './memory-cart.controller';
import { MemoryProductsController } from './memory-products.controller';
import { MemoryStoreService } from './memory-store.service';
import { MemoryUsersController } from './memory-users.controller';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: getRequiredConfig(config, 'JWT_SECRET', 'dev-secret'),
        signOptions: { expiresIn: '2h' },
      }),
    }),
  ],
  controllers: [
    MemoryAuthController,
    MemoryProductsController,
    MemoryUsersController,
    MemoryCartController,
  ],
  providers: [MemoryStoreService, JwtStrategy, RolesGuard],
})
export class MemoryModule {}
