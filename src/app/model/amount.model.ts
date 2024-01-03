import { ProductAttribute } from './ProductAttribute.model';
import { Product } from './product.model';

export declare class Amount {
  date: string;
  checked: boolean;
  product: Product;
  quantity: number;
  productAttributes: ProductAttribute[]
}
