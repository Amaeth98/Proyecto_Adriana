import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { MemoryStoreService } from './memory-store.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class MemoryUsersController {
  constructor(private readonly store: MemoryStoreService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    const user = {
      id: this.store.nextUserId(),
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: 'usuario' as const,
    };
    this.store.users.push(user);
    return this.publicUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: JwtPayload) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@CurrentUser() currentUser: JwtPayload, @Body() dto: UpdateUserDto) {
    const user = this.store.users.find((item) => item.id === currentUser.sub);
    if (!user) return null;
    if (
      dto.email &&
      dto.email !== user.email &&
      this.store.users.some((item) => item.email === dto.email)
    ) {
      throw new ConflictException('El email ya esta registrado');
    }

    if (dto.name !== undefined) user.name = dto.name;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.password !== undefined) user.password = dto.password;
    return this.publicUser(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.store.users.map((user) => this.publicUser(user));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    const user = this.store.users.find((item) => item.id === id);
    if (!user) return null;
    Object.assign(user, dto);
    return this.publicUser(user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.store.users = this.store.users.filter((item) => item.id !== id);
    return { deleted: true };
  }

  private publicUser(user: (typeof this.store.users)[number]) {
    const { password: _password, ...publicUser } = user;
    return publicUser;
  }
}
