import { IsOptional, IsString } from 'class-validator';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateTagDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({
    message: 'NAME_IS_STRING',
  })
  name: string;

  @ApiHideProperty()
  user: any;
}
