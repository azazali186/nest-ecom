import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SocialMediaDto {
  @ApiPropertyOptional()
  @IsString({
    message: 'SLUG_IS_STRING',
  })
  fb: string;

  @ApiPropertyOptional()
  @IsString({
    message: 'SLUG_IS_STRING',
  })
  tg: string;

  @ApiPropertyOptional()
  @IsString({
    message: 'SLUG_IS_STRING',
  })
  wa: string;

  @ApiPropertyOptional()
  @IsString({
    message: 'SLUG_IS_STRING',
  })
  email: string;
}
