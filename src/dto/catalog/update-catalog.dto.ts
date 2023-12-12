import { IsArray, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateTranslationDto } from '../translation/update-translation.dto';
export class UpdateCatalogDto {
  @ApiPropertyOptional({ type: String })
  @IsString()
  code: string;

  @ApiPropertyOptional({ type: [Number] })
  @IsArray()
  productIds: number[];

  @ApiPropertyOptional({ type: [UpdateTranslationDto] })
  @IsArray()
  translations: UpdateTranslationDto[] | null;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  images?: string[];
}
