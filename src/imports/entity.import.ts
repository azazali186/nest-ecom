import { AdminPage } from 'src/entities/admin-page.entity';
import { Cart } from 'src/entities/cart.entity';
import { Catalog } from 'src/entities/catalog.entity';
import { Category } from 'src/entities/category.entity';
import { Currency } from 'src/entities/currency.entity';
import { Files } from 'src/entities/files.entity';
import { Images } from 'src/entities/images.entity';
import { Language } from 'src/entities/language.entity';
import { Log } from 'src/entities/log.entity';
import { Permission } from 'src/entities/permission.entity';
import { Price } from 'src/entities/price.entity';
import { ProductFeature } from 'src/entities/product-features.entity';
import { ProductInteraction } from 'src/entities/product-interaction.entity';
import { Product } from 'src/entities/product.entity';
import { Role } from 'src/entities/role.entity';
import { Search } from 'src/entities/search.entity';
import { Session } from 'src/entities/session.entity';
import { Shop } from 'src/entities/shop.entity';
import { Stock } from 'src/entities/stock.entity';
import { Tag } from 'src/entities/tag.entity';
import { Translations } from 'src/entities/translation.entity';
import { User } from 'src/entities/user.entity';
import { Variation } from 'src/entities/variations.entity';

export const ImportEntities = [
  Language,
  Currency,
  User,
  Role,
  Permission,
  AdminPage,
  Log,
  Session,
  Images,
  Product,
  Category,
  Translations,
  ProductFeature,
  Stock,
  Price,
  Images,
  ProductInteraction,
  Files,
  Catalog,
  Variation,
  Cart,
  Tag,
  Shop,
  Search,
];
