import { InjectRepository } from '@nestjs/typeorm';
import { ImagesDto } from 'src/dto/images/image.dto';
import { Images } from 'src/entities/images.entity';
import { Repository } from 'typeorm';
import { ProductRepository } from './product.repository';
import { CategoryRepository } from './category.repository';
import { StockRepository } from './stock.repository';

export class ImagesRepository extends Repository<Images> {
  constructor(
    @InjectRepository(Images)
    private imgRepo: Repository<Images>,
    @InjectRepository(CategoryRepository)
    private catRepo: CategoryRepository,

    @InjectRepository(StockRepository)
    private stRepo: StockRepository,

    @InjectRepository(ProductRepository)
    private prodRepo: ProductRepository,
  ) {
    super(imgRepo.target, imgRepo.manager, imgRepo.queryRunner);
  }

  async createImage(imageDto: ImagesDto) {
    const { url, category_id, product_id, stock_id } = imageDto;
    const image = new Images();
    image.url = url;

    if (category_id) {
      const cat = await this.catRepo.findOne({ where: { id: category_id } });
      image.categories = cat;
    }

    if (product_id) {
      const prod = await this.prodRepo.findOne({ where: { id: product_id } });
      image.products = prod;
    }

    if (stock_id) {
      const st = await this.stRepo.findOne({ where: { id: stock_id } });
      image.stocks = st;
    }
    await this.imgRepo.save(image);

    return image;
  }
}
