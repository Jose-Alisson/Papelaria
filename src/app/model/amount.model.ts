import { ProductAttribute } from './ProductAttribute.model';
import { Account } from './account.model';
import { Product } from './product.model';

export declare class Amount {
  id: string
  account: Account;
  product: Product;
  quantity: number;
  productAttributes: ProductAttribute[]
  status: string
}
