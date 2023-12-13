import { IsString, IsArray } from 'class-validator';
import { CreateTranslationDto } from '../translation/create-translation.dto';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateCatalogDto {
  @ApiProperty({ type: String })
  @IsString()
  code: string;

  @ApiProperty({ type: [Number] })
  @IsArray()
  productIds: number[];

  @ApiProperty({ type: [CreateTranslationDto] })
  @IsArray()
  translations: CreateTranslationDto[] | null;

  @ApiProperty({ type: [String] })
  @IsArray()
  images?: string[];

  @ApiHideProperty()
  user: any;
}
