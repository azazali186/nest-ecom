import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateAdminPageDto {
  @ApiPropertyOptional({ type: [Number] })
  @IsArray()
  permissionIds: number[];

  @ApiPropertyOptional({ type: String })
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({ nullable: true })
  @IsString()
  @IsOptional()
  icon: string;

  @ApiPropertyOptional({ nullable: true })
  @IsString()
  @IsOptional()
  url: string;

  @ApiPropertyOptional({ nullable: true })
  @IsString()
  @IsOptional()
  route_name: string;

  @ApiPropertyOptional({ type: [Number] })
  @IsArray()
  @IsOptional()
  childrenIds: number[];

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  parentId: number;
}
