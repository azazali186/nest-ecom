import { IsString } from 'class-validator';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateLanguageDto {
  @ApiPropertyOptional()
  @IsString({
    message: 'NAME_IS_STRING',
  })
  name: string;

  @ApiPropertyOptional()
  @IsString({
    message: 'SYMBOL_IS_STRING',
  })
  code: string;

  @ApiHideProperty()
  user: any;
}
