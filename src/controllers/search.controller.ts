import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchDto } from 'src/dto/search/search.dto';
import { SearchService } from 'src/services/search.service';

@ApiTags('Search Management')
@ApiBearerAuth()
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Get()
  search(@Query() req: SearchDto) {
    return this.searchService.search(req);
  }
}
