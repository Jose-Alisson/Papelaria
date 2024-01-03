import { Injectable } from '@angular/core';
import { Amount } from 'src/app/model/amount.model';
import { Product } from 'src/app/model/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  cartNewItems = 0

  cart: Amount[] = [
    // {
    //   date: '12/13/2023',
    //   checked: true,
    //   product: {
    //     id: '0',
    //     productName: 'Luluzinho',
    //     category: 'Decoração',
    //     description: 'Prendedor de cabelo',
    //     basePrice: 5.0,
    //     photoObject: '',
    //     photoUrl: '',
    //     available: 15,
    //     productAttributes: [],
    //     allDescription: ''
    //   },
    //   quantity: 1,
    //   productAttributes: []
    // },
  ];

  constructor() {}

  chekedAllDate(date: string, checked: boolean){
    const amounts = this.cart.filter(data => data.date === date)
    amounts.forEach(amount => {
      amount.checked = checked
    })
  }
}
