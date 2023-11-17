import { IsNumber, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateTranslationDto {
  @ApiPropertyOptional()
  @IsString({
    message: 'NAME_IS_STRING',
  })
  name: string;

  @ApiPropertyOptional()
  @IsNumber()
  language_id: number;

  @ApiPropertyOptional()
  @IsString({
    message: 'DESCRIPTION_IS_STRING',
  })
  description: string;

  @ApiPropertyOptional()
  @IsString({
    message: 'META_TITLE_IS_STRING',
  })
  meta_title: string;

  @ApiPropertyOptional()
  @IsString({
    message: 'META_KEYWORD_IS_STRING',
  })
  meta_keywords: string;

  @ApiPropertyOptional()
  @IsString({
    message: 'META_DESCRIPTION_IS_STRING',
  })
  meta_discriptions: string;

  @ApiPropertyOptional()
  @IsNumber()
  stock_id: number;

  @ApiPropertyOptional()
  @IsNumber()
  product_id: number;

  @ApiPropertyOptional()
  @IsNumber()
  category_id: number;
}
