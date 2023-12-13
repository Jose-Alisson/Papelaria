import { SafeUrl } from "@angular/platform-browser";

export declare class Product {
  id:string;
  photoObject: SafeUrl
  photoUrl: string
  productName: string;
  description: string;
  price: number;
  category: string;
  available: number;
}
