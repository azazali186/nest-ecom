import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateTranslationDto } from '../translation/create-translation.dto';
import { CreateImageDto } from '../images/create-images.dto';
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
  @IsNotEmpty({
    message: 'TRANSLATIONS_IS_REQUIRED',
  })
  @IsArray({
    message: 'TRANSLATIONS_IS_ARRAY',
  })
  translations: CreateTranslationDto[];

  @ApiPropertyOptional()
  @IsArray({
    message: 'IMAGES_IS_ARRAY',
  })
  images: CreateImageDto[];
}
