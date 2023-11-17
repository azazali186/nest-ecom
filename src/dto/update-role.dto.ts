import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { AdminPagePermissionsDto } from './admin-page-permissions.dto';

export class UpdateRoleDto {
  @ApiPropertyOptional()
  @IsString({
    message: 'NAME_IS_STRING',
  })
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsString({
    message: 'DESCRIPTION_IS_STRING',
  })
  @IsOptional()
  description: string;

  @ApiPropertyOptional()
  @IsArray({
    message: 'PERMISSION_IS_ARRAY',
  })
  @IsOptional()
  permissions?: AdminPagePermissionsDto[];
}
