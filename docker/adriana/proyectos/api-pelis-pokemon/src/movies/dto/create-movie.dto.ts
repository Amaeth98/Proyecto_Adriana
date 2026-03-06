import { IsInt, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsInt()
  @Min(1888)
  @Max(2100)
  year: number;

  @IsString()
  @MinLength(1)
  director: string;
}