import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateVariationDto {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray({
    message: 'VALUES_IS_ARRAY',
  })
  @IsOptional()
  values: string[];
}
