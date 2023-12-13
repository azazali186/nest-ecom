import { IsNotEmpty, IsString } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
export class CreateLanguageDto {
  @ApiProperty()
  @IsString({
    message: 'NAME_IS_STRING',
  })
  @IsNotEmpty({
    message: 'NAME_IS_REQUIRED',
  })
  name: string;

  @ApiProperty()
  @IsString({
    message: 'SYMBOL_IS_STRING',
  })
  @IsNotEmpty({
    message: 'SYMBOL_IS_REQUIRED',
  })
  code: string;

  @ApiHideProperty()
  user: any;
}
