import { IsNotEmpty, IsString } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { SocialMediaDto } from '../social-media.dto';

export class CreateShopDto extends SocialMediaDto {
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
    message: 'SLUG_IS_STRING',
  })
  @IsNotEmpty({
    message: 'SLUG_IS_REQUIRED',
  })
  slug: string;

  @ApiHideProperty()
  user: any;
}
