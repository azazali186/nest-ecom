import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsArray,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { PriceDto } from '../stock/price.dto';

export class CombinationDto {
  @ApiProperty({ type: String })
  @IsNotEmpty({
    message: 'NAME_IS_REQUIRED',
  })
  @IsString({
    message: 'NAME_IS_STRING',
  })
  name: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  quantity: number;

  @ApiProperty({ type: [PriceDto], required: false })
  @IsArray()
  @IsNotEmpty()
  prices?: PriceDto[];

  @ApiHideProperty()
  user: any;
}
