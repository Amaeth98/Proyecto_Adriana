import { Controller, Get, Post, Body, Param, Delete, Put, Query} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  // Seed, ejecutar 1 vez para cargar 15 pokemons
  @Post('seed')
  seed() {
    return this.pokemonService.seed15();
  }

  // CREATE
  @Post()
  create(@Body() body: CreatePokemonDto) {
    return this.pokemonService.create(body);
  }

  // READ ALL
  @Get()
  findAll() {
    return this.pokemonService.findAll();
  }

  // Busquedas
  @Get('search/name')
  searchName(@Query('q') q: string) {
    return this.pokemonService.searchByName(q ?? '');
  }

  @Get('search/type')
  searchType(@Query('type') type: string) {
    return this.pokemonService.searchByType(type ?? '');
  }

  @Get('search/min-hp')
  searchMinHp(@Query('min') min: string) {
    return this.pokemonService.searchByMinHp(Number(min));
  }

  // READ ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOne(Number(id));
  }

  // UPDATE
  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdatePokemonDto) {
    return this.pokemonService.update(Number(id), body);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pokemonService.remove(Number(id));
  }
}