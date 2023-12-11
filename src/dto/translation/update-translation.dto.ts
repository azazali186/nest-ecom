import { IsNumber, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateTranslationDto {
  @ApiPropertyOptional({ type: 'number' })
  @IsNumber()
  id: number;

  @ApiPropertyOptional()
  @IsString({
    message: 'NAME_IS_STRING',
  })
  name: string;

  @ApiPropertyOptional()
  @IsString({
    message: 'LANGUAGE_CODE_IS_STRING',
  })
  language_code: string;

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
