import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SearchBaseDto } from '../search-base-dto';

export class SearchDto extends SearchBaseDto {
  @ApiPropertyOptional()
  @IsOptional()
  search: string;
}
