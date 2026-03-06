import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly repo: Repository<Movie>,
  ) {}

  // CREATE
  async create(dto: CreateMovieDto) {
    const movie = this.repo.create(dto);
    return this.repo.save(movie);
  }

  // READ ALL
  async findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  // READ ONE
  async findOne(id: number) {
    const movie = await this.repo.findOne({ where: { id } });
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  // UPDATE
  async update(id: number, dto: UpdateMovieDto) {
    const movie = await this.findOne(id);
    Object.assign(movie, dto);
    return this.repo.save(movie);
  }

  // DELETE
  async remove(id: number) {
    const movie = await this.findOne(id);
    await this.repo.remove(movie);
    return { deleted: true };
  }

  // Buscar por título (contiene, no distingue mayúsculas)
  async searchByTitle(q: string) {
    return this.repo.find({
      where: { title: ILike(`%${q}%`) },
      order: { year: 'DESC' },
    });
  }

  // Buscar por year entre min y max
  async searchByYearBetween(minYear: number, maxYear: number) {
    return this.repo.find({
      where: { year: Between(minYear, maxYear) },
      order: { year: 'ASC' },
    });
  }

  // Seed, inserta 10 peliculas si la tabla está vacía
  async seed10() {
    const count = await this.repo.count();
    if (count > 0) {
      return { ok: false, message: 'Ya hay datos en peliculas.' };
    }

    const data: CreateMovieDto[] = [
      { title: 'Interstellar', year: 2014, director: 'Christopher Nolan' },
      { title: 'Inception', year: 2010, director: 'Christopher Nolan' },
      { title: 'The Matrix', year: 1999, director: 'Wachowskis' },
      { title: 'Gladiator', year: 2000, director: 'Ridley Scott' },
      { title: 'Parasite', year: 2019, director: 'Bong Joon-ho' },
      { title: 'Titanic', year: 1997, director: 'James Cameron' },
      { title: 'The Godfather', year: 1972, director: 'Francis Ford Coppola' },
      { title: 'Dune', year: 2021, director: 'Denis Villeneuve' },
      { title: 'Avatar', year: 2009, director: 'James Cameron' },
      { title: 'Star Wars', year: 1977, director: 'George Lucas' },
    ];

    const entities = data.map((d) => this.repo.create(d));
    await this.repo.save(entities);

    return { ok: true, inserted: entities.length };
  }
}