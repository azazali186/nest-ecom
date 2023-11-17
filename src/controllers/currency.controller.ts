import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ValidationPipe,
  Request,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCurrencyDto } from 'src/dto/create-currency.dto';
import { SearchCurrencyDto } from 'src/dto/search-currency.dto';
import { CurrencyService } from 'src/services/currency.service';

@ApiTags('Currency Management')
@ApiBearerAuth()
@Controller('currencies')
export class CurrencyController {
  constructor(private readonly currService: CurrencyService) {}
  @Post()
  create(@Body(ValidationPipe) req: CreateCurrencyDto) {
    return this.currService.create(req);
  }
  @Get()
  findAll(@Query() req: SearchCurrencyDto) {
    return this.currService.findAll(req);
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.currService.findOne(id);
  }
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.currService.remove(id);
  }
}
