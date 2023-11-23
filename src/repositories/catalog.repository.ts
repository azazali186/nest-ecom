import { InjectRepository } from "@nestjs/typeorm";
import { CreateCatalogDto } from "src/dto/catalog/create-catalog.dto";
import { SearchCatalogDto } from "src/dto/catalog/search-catalog.dto";
import { UpdateCatalogDto } from "src/dto/catalog/update-catalog.dto";
import { Catalog } from "src/entities/catalog.entity";
import { Repository } from "typeorm";

export class CatalogRepository extends Repository<Catalog> {
    createCatalog(req: CreateCatalogDto) {
      throw new Error('Method not implemented.');
    }
    findCatalogs(name: SearchCatalogDto) {
      throw new Error('Method not implemented.');
    }
    getCatalogId(id: number) {
      throw new Error('Method not implemented.');
    }
    updateCatalog(id: any, req: UpdateCatalogDto) {
      throw new Error('Method not implemented.');
    }
    constructor(
      @InjectRepository(Catalog)
      private cpRepo: Repository<Catalog>,
    ) {
      super(
        cpRepo.target,
        cpRepo.manager,
        cpRepo.queryRunner,
      );
    }
  }