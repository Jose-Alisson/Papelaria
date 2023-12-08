import { Component, ViewChild, ElementRef } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss', '../cart/cart.component.scss'],
})
export class ItemComponent {
  counter = 1;

  sideActive = false;

  @ViewChild('search', { static: true })
  search!: HTMLInputElement;

  toogleActive() {
    this.sideActive = !this.sideActive;
  }

  constructor(private cart: CartService) {}

  increment() {
    this.counter++;
  }

  getProductList() {
    return this.cart.cart;
  }

  decrement() {
    if (this.counter > 1) {
      this.counter--;
    }
  }

  getCartLength() {
    return this.cart.cart.length;
  }
}
