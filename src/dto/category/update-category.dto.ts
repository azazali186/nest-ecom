import { IsArray, IsOptional } from 'class-validator';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateTranslationDto } from '../translation/update-translation.dto';
import { ImagesDto } from '../images/image.dto';
export class UpdateCategoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray({
    message: 'TRANSLATIONS_IS_ARRAY',
  })
  translations: UpdateTranslationDto[];

  @ApiPropertyOptional()
  @IsOptional()
  images: ImagesDto[];

  @ApiHideProperty()
  user: any;
}
