import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  IsIn,
} from 'class-validator';
import { Shop } from 'src/entities/shop.entity';
import { UserStatus } from 'src/enum/user-status.enum';

export class UpdateVendorDto {
  @ApiPropertyOptional()
  @IsString({
    message: 'INVALID_FORMAT_USERNAME',
  })
  @IsOptional()
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({
    message: 'INVALID_FORMAT_PASSWORD',
  })
  password?: string;

  @ApiPropertyOptional()
  @IsString({
    message: 'INVALID_NAME',
  })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString({
    message: 'MOBILE_NUMBER_IS_REQUIRED',
  })
  @Matches(/^[0-9]+$/, {
    message: 'INVALID_MOBILE_NUMBER',
  })
  @IsOptional()
  mobileNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn([UserStatus.ACTIVE, UserStatus.INACTIVE], {
    message: 'INVALID_STATUS_ACTIVE_INACTIVE',
  })
  status: UserStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({
    message: 'INVALID_TELEGRAM_ID',
  })
  telegram_id: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({
    message: 'SHOP_NAME_IS_REQUIRED',
  })
  shopName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({
    message: 'SHOP_SLUG_IS_REQUIRED',
  })
  shopSlug: string;

  @ApiPropertyOptional()
  @IsOptional()
  logoId: number;

  @ApiPropertyOptional()
  @IsOptional()
  bannerId: number;

  @ApiHideProperty()
  user: any;

  @ApiPropertyOptional()
  @IsOptional()
  wa: string;

  @ApiPropertyOptional()
  @IsOptional()
  fb: string;

  @ApiPropertyOptional()
  @IsOptional()
  tg: string;
}
