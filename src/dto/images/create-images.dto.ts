import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateImageDto {
  @ApiProperty()
  @IsString({
    message: 'NAME_IS_STRING',
  })
  @IsNotEmpty({
    message: 'NAME_IS_REQUIRED',
  })
  url: string;

  @ApiPropertyOptional()
  @IsNumber()
  target_id: number;

  @ApiPropertyOptional()
  @IsNumber()
  category_id: number;
}
