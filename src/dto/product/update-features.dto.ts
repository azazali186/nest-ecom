import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { IsArray, IsString, IsNumber, IsOptional } from 'class-validator';
import { UpdateTranslationDto } from '../translation/update-translation.dto';

export class UpdateFeaturesDto {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  id: number;

  @ApiPropertyOptional({ type: [UpdateTranslationDto] })
  @IsOptional()
  @IsArray({
    message: 'TRANSLATIONS_IS_ARRAY',
  })
  translations: UpdateTranslationDto[];

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString({
    message: 'NAME_IS_STRING',
  })
  name: string;

  @ApiHideProperty()
  user: any;
}
