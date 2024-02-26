import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { CreateTranslationDto } from '../translation/create-translation.dto';
import { ImagesDto } from '../images/image.dto';
export class CreateCategoryDto {
  @ApiProperty()
  @IsString({
    message: 'NAME_IS_STRING',
  })
  @IsNotEmpty({
    message: 'NAME_IS_REQUIRED',
  })
  name: string;

  @ApiProperty()
  @IsString({
    message: 'SLUG_IS_STRING',
  })
  @IsNotEmpty({
    message: 'SLUG_IS_REQUIRED',
  })
  slug: string;

  @ApiProperty({ type: [CreateTranslationDto] })
  @IsNotEmpty({
    message: 'TRANSLATIONS_IS_REQUIRED',
  })
  @IsArray({
    message: 'TRANSLATIONS_IS_ARRAY',
  })
  translations: CreateTranslationDto[];

  @ApiPropertyOptional({ type: [ImagesDto] })
  @IsOptional()
  @IsArray({
    message: 'IMAGES_IS_ARRAY',
  })
  images: ImagesDto[];

  @ApiHideProperty()
  user: any;
}
