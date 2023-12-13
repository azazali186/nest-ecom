import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class BulkProductUploadDto {
  @ApiProperty({ type: [CreateProductDto] })
  @IsArray()
  data: CreateProductDto[];

  @ApiHideProperty()
  user: any;
}
