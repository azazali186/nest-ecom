import { IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateTranslationDto {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  id: number;

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
  meta_descriptions: string;
}
