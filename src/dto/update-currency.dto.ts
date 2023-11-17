import { IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateCurrencyDto {
  @ApiPropertyOptional()
  @IsString({
    message: 'NAME_IS_STRING',
  })
  name: string;

  @ApiPropertyOptional()
  @IsString({
    message: 'SYMBOL_IS_STRING',
  })
  code: string;

  @ApiPropertyOptional()
  @IsString({
    message: 'SYMBOL_IS_STRING',
  })
  symbol: string;
}
