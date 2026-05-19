import { IsIn, IsOptional, IsString } from 'class-validator';

export class PayCartDto {
  @IsIn(['card', 'paypal', 'transfer'])
  method: 'card' | 'paypal' | 'transfer';

  @IsOptional()
  @IsString()
  holderName?: string;
}
