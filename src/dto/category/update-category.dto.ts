import { IsArray, IsString } from 'class-validator';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateTranslationDto } from '../translation/update-translation.dto';
import { ImagesDto } from '../images/image.dto';
export class UpdateCategoryDto {
  @ApiPropertyOptional()
  @IsString({
    message: 'NAME_IS_STRING',
  })
  name: string;

  @ApiPropertyOptional()
  @IsArray({
    message: 'TRANSLATIONS_IS_ARRAY',
  })
  translations: UpdateTranslationDto[];

  @ApiPropertyOptional()
  @IsArray({
    message: 'IMAGES_IS_ARRAY',
  })
  images: ImagesDto[];

  @ApiHideProperty()
  user: any;
}
