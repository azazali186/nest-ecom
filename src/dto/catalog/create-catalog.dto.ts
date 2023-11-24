import { IsOptional, IsString, IsArray } from 'class-validator';
import { CreateTranslationDto } from '../translation/create-translation.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCatalogDto {
  @ApiProperty({ type: [Number] })
  @IsArray()
  productIds: number[];

  @ApiProperty({ type: [CreateTranslationDto] })
  @IsArray()
  translations: CreateTranslationDto[] | null;

  @ApiProperty({ type: [String] })
  @IsArray()
  images?: string[];
}
