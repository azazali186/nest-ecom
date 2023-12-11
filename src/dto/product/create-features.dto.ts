import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, IsString } from 'class-validator';
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

  @ApiProperty({ type: String })
  @IsNotEmpty({
    message: 'NAME_IS_REQUIRED',
  })
  @IsString({
    message: 'NAME_IS_STRING',
  })
  name: string;
}
