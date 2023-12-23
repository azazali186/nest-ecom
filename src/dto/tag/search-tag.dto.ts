import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SearchBaseDto } from '../search-base-dto';

export class SearchTagDto extends SearchBaseDto {
  @ApiPropertyOptional()
  @IsOptional()
  name: string;

  @ApiHideProperty()
  user: any;
}
