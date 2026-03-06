import { IsInt, IsString, Max, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  type: string;

  @IsInt()
  @Min(1)
  @Max(999)
  hp: number;

  @IsInt()
  @Min(1)
  @Max(100)
  level: number;
}