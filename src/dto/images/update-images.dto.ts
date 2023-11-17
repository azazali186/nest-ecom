import { IsNumber, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateImageDto {
  @ApiPropertyOptional()
  @IsString({
    message: 'NAME_IS_STRING',
  })
  url: string;

  @ApiPropertyOptional()
  @IsNumber()
  target_id: number;

  @ApiPropertyOptional()
  @IsNumber()
  category_id: number;
}
