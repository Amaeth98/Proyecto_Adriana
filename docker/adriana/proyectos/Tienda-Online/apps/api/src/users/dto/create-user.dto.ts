import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'La password debe tener mayuscula, minuscula y numero',
  })
  password: string;

  @IsOptional()
  role?: UserRole;
}
