import { SafeUrl } from "@angular/platform-browser";

export declare class Product {
  id:string;
  photoObject: SafeUrl
  productName: string;
  description: string;
  price: number;
  category: string;
}
