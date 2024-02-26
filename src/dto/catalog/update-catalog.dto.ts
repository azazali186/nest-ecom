import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateTranslationDto } from '../translation/update-translation.dto';
export class UpdateCatalogDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  code: string;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  productIds: number[];

  @ApiPropertyOptional({ type: [UpdateTranslationDto] })
  @IsOptional()
  @IsArray()
  translations: UpdateTranslationDto[] | null;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiHideProperty()
  user: any;
}
