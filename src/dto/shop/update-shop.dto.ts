import { IsString } from 'class-validator';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SocialMediaDto } from '../social-media.dto';
export class UpdateShopDto extends SocialMediaDto {
  @ApiPropertyOptional()
  @IsString({
    message: 'NAME_IS_STRING',
  })
  name: string;

  @ApiPropertyOptional()
  @IsString({
    message: 'SLUG_IS_STRING',
  })
  slug: string;

  @ApiHideProperty()
  user: any;
}
