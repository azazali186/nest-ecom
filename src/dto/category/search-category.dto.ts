import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SearchBaseDto } from '../search-base-dto';

export class SearchCategoryDto extends SearchBaseDto {
  @ApiPropertyOptional()
  
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  category_id: number;

  @ApiHideProperty()
  user: any;
}
