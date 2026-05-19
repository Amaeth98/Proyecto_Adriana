import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  findByEmailWithPassword(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role'],
    });
  }

  async create(dto: CreateUserDto, forceRole = false) {
    const exists = await this.usersRepository.existsBy({ email: dto.email });
    if (exists) throw new ConflictException('El email ya esta registrado');

    const user = this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
      role: forceRole ? dto.role ?? 'usuario' : 'usuario',
    });
    return this.usersRepository.save(user);
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (dto.email && dto.email !== user.email) {
      const exists = await this.usersRepository.existsBy({ email: dto.email });
      if (exists) throw new ConflictException('El email ya esta registrado');
    }
    Object.assign(user, dto);
    if (dto.password) user.password = await bcrypt.hash(dto.password, 10);
    return this.usersRepository.save(user);
  }

  async updateProfile(id: number, dto: UpdateUserDto) {
    const { name, email, password } = dto;
    return this.update(id, { name, email, password });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    return { deleted: true };
  }
}
