import { Body, ConflictException, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../auth/dto/login.dto';
import { JwtPayload } from '../auth/jwt-payload';
import { MemoryStoreService } from './memory-store.service';

@Controller('auth')
export class MemoryAuthController {
  constructor(
    private readonly store: MemoryStoreService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = this.store.users.find((item) => item.email === dto.email);
    if (!user || user.password !== dto.password) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      token: await this.jwtService.signAsync(payload),
      user: payload,
    };
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    if (this.store.users.some((item) => item.email === dto.email)) {
      throw new ConflictException('El email ya esta registrado');
    }

    const user = {
      id: this.store.nextUserId(),
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: 'usuario' as const,
    };
    this.store.users.push(user);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      token: await this.jwtService.signAsync(payload),
      user: payload,
    };
  }
}
