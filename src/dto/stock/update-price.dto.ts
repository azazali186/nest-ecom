import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdatePriceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({ type: 'number', required: false })
  @IsNotEmpty()
  @IsNumber()
  currency_id: number;

  @ApiProperty({ type: 'number', required: false })
  @IsNotEmpty()
  @IsNumber()
  stock_id: number;
}
