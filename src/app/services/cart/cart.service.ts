import { Injectable } from '@angular/core';
import { Amount } from 'src/app/model/amount.model';
import { Product } from 'src/app/model/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  cartNewItems = 0

  cart: Amount[] = [
    {
      date: '12/12/2023',
      checked: false,
      product: {
        id: '0',
        productName: 'Luluzinho',
        category: 'Decoração',
        description: 'Prendedor de cabelo',
        price: 5.0,
        photoObject: '',
        photoUrl: '',
        available: 10,
      },
      amount: 1,
    },
    {
      date: '12/12/2023',
      checked: true,
      product: {
        id: '0',
        productName: 'Luluzinho',
        category: 'Decoração',
        description: 'Prendedor de cabelo',
        price: 5.0,
        photoObject: '',
        photoUrl: '',
        available: 12,
      },
      amount: 1,
    },
    {
      date: '12/13/2023',
      checked: true,
      product: {
        id: '0',
        productName: 'Luluzinho',
        category: 'Decoração',
        description: 'Prendedor de cabelo',
        price: 5.0,
        photoObject: '',
        photoUrl: '',
        available: 15,
      },
      amount: 1,
    },
  ];

  constructor() {}

  chekedAllDate(date: string, checked: boolean){
    const amounts = this.cart.filter(data => data.date === date)
    amounts.forEach(amount => {
      amount.checked = checked
    })
  }
}
