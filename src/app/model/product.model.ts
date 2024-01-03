import { SafeUrl } from "@angular/platform-browser";
import { ProductAttribute } from "./ProductAttribute.model";

export declare class Product {
  id:string;
  photoObject: SafeUrl
  photoUrl: string
  productName: string;
  description: string;
  allDescription: string;
  basePrice: number;
  category: string;
  available: number;
  productAttributes: ProductAttribute[];
}
