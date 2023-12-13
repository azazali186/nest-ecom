import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class BulkCreateCategoryDto {
  @ApiProperty({ type: [CreateCategoryDto] })
  @IsArray()
  data: CreateCategoryDto[];

  @ApiHideProperty()
  user: any;
}
