import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, MoreThan, Repository } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly repo: Repository<Pokemon>,
  ) {}

  // CREATE
  async create(dto: CreatePokemonDto) {
    const p = this.repo.create(dto);
    return this.repo.save(p);
  }

  // READ ALL
  async findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  // READ ONE
  async findOne(id: number) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Pokemon not found');
    return p;
  }

  // UPDATE
  async update(id: number, dto: UpdatePokemonDto) {
    const p = await this.findOne(id);
    Object.assign(p, dto);
    return this.repo.save(p);
  }

  // DELETE
  async remove(id: number) {
    const p = await this.findOne(id);
    await this.repo.remove(p);
    return { deleted: true };
  }

  // Buscar por nombre (contiene)
  async searchByName(q: string) {
    return this.repo.find({
      where: { name: ILike(`%${q}%`) },
      order: { id: 'ASC' },
    });
  }

  // Buscar por tipo (exacto, no diferencia mayúsculas)
  async searchByType(type: string) {
    return this.repo.find({
      where: { type: ILike(type) },
      order: { hp: 'DESC' },
    });
  }

  // Buscar por HP mayor que X
  async searchByMinHp(minHp: number) {
    return this.repo.find({
      where: { hp: MoreThan(minHp) },
      order: { hp: 'DESC' },
    });
  }

  // Seed, insertar 15 Pokémon solo si la tabla está vacía
  async seed15() {
    const count = await this.repo.count();
    if (count > 0) {
      return { ok: false, message: 'Ya hay datos en pokemon.' };
    }

    const data: CreatePokemonDto[] = [
      { name: 'Pikachu', type: 'electric', hp: 35, level: 12 },
      { name: 'Charizard', type: 'fire', hp: 78, level: 36 },
      { name: 'Blastoise', type: 'water', hp: 79, level: 36 },
      { name: 'Venusaur', type: 'grass', hp: 80, level: 36 },
      { name: 'Gengar', type: 'ghost', hp: 60, level: 34 },
      { name: 'Snorlax', type: 'normal', hp: 160, level: 30 },
      { name: 'Dragonite', type: 'dragon', hp: 91, level: 55 },
      { name: 'Alakazam', type: 'psychic', hp: 55, level: 40 },
      { name: 'Machamp', type: 'fighting', hp: 90, level: 38 },
      { name: 'Gyarados', type: 'water', hp: 95, level: 33 },
      { name: 'Arcanine', type: 'fire', hp: 90, level: 35 },
      { name: 'Jolteon', type: 'electric', hp: 65, level: 28 },
      { name: 'Lapras', type: 'water', hp: 130, level: 32 },
      { name: 'Scizor', type: 'steel', hp: 70, level: 30 },
      { name: 'Tyranitar', type: 'rock', hp: 100, level: 50 },
    ];

    const entities = data.map(d => this.repo.create(d));
    await this.repo.save(entities);

    return { ok: true, inserted: entities.length };
  }
}