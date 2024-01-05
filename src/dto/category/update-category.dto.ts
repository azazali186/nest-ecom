import { IsArray } from 'class-validator';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateTranslationDto } from '../translation/update-translation.dto';
import { ImagesDto } from '../images/image.dto';
export class UpdateCategoryDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  slug: string;

  @ApiPropertyOptional()
  @IsArray({
    message: 'TRANSLATIONS_IS_ARRAY',
  })
  translations: UpdateTranslationDto[];

  @ApiPropertyOptional()
  images: ImagesDto[];

  @ApiHideProperty()
  user: any;
}
