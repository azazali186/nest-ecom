import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCurrencyDto } from 'src/dto/create-currency.dto';
import { SearchCurrencyDto } from 'src/dto/search-currency.dto';
import { UpdateCurrencyDto } from 'src/dto/update-currency.dto';
import { Currency } from 'src/entities/currency.entity';
import { LangService } from 'src/services/lang.service';
import { ApiResponse } from 'src/utils/response.util';
import { Like, Repository } from 'typeorm';

export class CurrencyRepository extends Repository<Currency> {
  constructor(
    @InjectRepository(Currency)
    private curRepo: Repository<Currency>,
    private langService: LangService,
  ) {
    super(curRepo.target, curRepo.manager, curRepo.queryRunner);
  }

  async createCurrency(req: CreateCurrencyDto) {
    const { code, symbol } = req;
    const currency = new Currency();
    currency.code = code;
    currency.symbol = symbol;
    return ApiResponse.create(
      this.curRepo.save(currency),
      201,
      this.langService.getTranslation('CREATED_SUCCESSFULLY', 'Currency'),
      null,
    );
  }

  getCurrencyId(id: number) {
    const data = this.findOne({ where: { id: id } });
    return ApiResponse.create(
      data,
      200,
      this.langService.getTranslation('GET_DATA_SUCCESS', 'Currency'),
      null,
    );
  }

  async findCurrencies(req: SearchCurrencyDto) {
    const { name, symbol, code } = req;
    const options = {
      where: {},
    };
    if (name) {
      options.where['name'] = Like(name);
    }
    if (symbol) {
      options.where['symbol'] = symbol;
    }

    if (code) {
      options.where['code'] = Like(code);
    }

    const [list, count] = await this.findAndCount({ where: options.where });

    return ApiResponse.paginate({ list, count });
  }

  async updateCurrency(id: any, req: UpdateCurrencyDto) {
    const curUpdate = await this.curRepo.findOne({
      where: {
        id: id,
      },
    });
    if (!curUpdate) {
      throw new NotFoundException({
        statusCode: 404,
        message: `INVALID_ID`,
        param: `${id}`,
      });
    }
    const { name, symbol, code } = req;
    if (name) {
      curUpdate.name = name;
    }
    if (symbol) {
      curUpdate.symbol = symbol;
    }

    if (code) {
      curUpdate.code = code;
    }

    return ApiResponse.create(this.save(curUpdate));
  }
}
