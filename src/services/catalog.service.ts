import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCatalogDto } from 'src/dto/catalog/create-catalog.dto';
import { SearchCatalogDto } from 'src/dto/catalog/search-catalog.dto';
import { UpdateCatalogDto } from 'src/dto/catalog/update-catalog.dto';
import { CatalogRepository } from 'src/repositories/catalog.repository';
import { ApiResponse } from 'src/utils/response.util';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(CatalogRepository)
    public cpRepo: CatalogRepository,
  ) {}

  create(req: CreateCatalogDto, user:any) {
    return this.cpRepo.createCatalog(req, user);
  }
  async findAll(name: SearchCatalogDto) {
    return this.cpRepo.findCatalogs(name);
  }
  findOne(id: number) {
    return this.cpRepo.getCatalogId(id);
  }
  update(id: any, req: UpdateCatalogDto) {
    return this.cpRepo.updateCatalog(id, req);
  }
  async remove(id: number) {
    const res = await this.cpRepo.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException(`Catalog with ID ${id} not found`);
    }
    return ApiResponse.success(null, 200, 'Catalog Deleted');
  }
}
