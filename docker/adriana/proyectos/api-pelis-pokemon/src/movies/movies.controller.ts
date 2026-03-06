import {Controller, Get, Post, Body, Param, Delete, Put, Query} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // Seed, ejecutar 1 vez para cargar 10 películas
  @Post('seed')
  seed() {
    return this.moviesService.seed10();
  }

  // CREATE
  @Post()
  create(@Body() body: CreateMovieDto) {
    return this.moviesService.create(body);
  }

  // READ ALL
  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  // Búsqueda por título
  @Get('search/title')
  searchTitle(@Query('q') q: string) {
    return this.moviesService.searchByTitle(q ?? '');
  }

  // Between de años
  @Get('search/year-between')
  searchBetween(@Query('min') min: string, @Query('max') max: string) {
    return this.moviesService.searchByYearBetween(Number(min), Number(max));
  }

  // READ ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(Number(id));
  }

  // UPDATE
  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateMovieDto) {
    return this.moviesService.update(Number(id), body);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(Number(id));
  }
}