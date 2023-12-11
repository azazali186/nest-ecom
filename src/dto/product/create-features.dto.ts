import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray } from 'class-validator';
import { CreateTranslationDto } from '../translation/create-translation.dto';

export class CreateFeaturesDto {
  @ApiProperty({ type: [CreateTranslationDto] })
  @IsNotEmpty({
    message: 'TRANSLATIONS_IS_REQUIRED',
  })
  @IsArray({
    message: 'TRANSLATIONS_IS_ARRAY',
  })
  translations: CreateTranslationDto[];
}
