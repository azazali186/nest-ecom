import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class PriceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({ type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  currency_id: number;

  @ApiProperty({ type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  stock_id: number;
}
