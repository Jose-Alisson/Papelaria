import { Injectable } from '@angular/core';
import { Product } from 'src/app/model/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  cart: Product[] = []/* [
    {
      id: '0',
      productName: 'Luluzinho',
      category: 'Decoração',
      description: 'Prendedor de cabelo',
      price: 5.0,
      photoObject: '',
    },
    {
      id: '0',
      productName: 'Luluzinho',
      category: 'Decoração',
      description: 'Prendedor de cabelo',
      price: 5.0,
      photoObject: '',
    },
    {
      id: '0',
      productName: 'Luluzinho',
      category: 'Decoração',
      description: 'Prendedor de cabelo',
      price: 5.0,
      photoObject: '',
    },
  ];*/

  constructor() {}
}
