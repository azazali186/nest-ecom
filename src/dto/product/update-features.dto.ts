import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { IsArray, IsString, IsNumber } from 'class-validator';
import { UpdateTranslationDto } from '../translation/update-translation.dto';

export class UpdateFeaturesDto {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  id: number;

  @ApiPropertyOptional({ type: [UpdateTranslationDto] })
  @IsArray({
    message: 'TRANSLATIONS_IS_ARRAY',
  })
  translations: UpdateTranslationDto[];

  @ApiPropertyOptional({ type: String })
  @IsString({
    message: 'NAME_IS_STRING',
  })
  name: string;

  @ApiHideProperty()
  user: any;
}
