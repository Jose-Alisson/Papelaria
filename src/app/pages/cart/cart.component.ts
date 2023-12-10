import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss', '../buscar/buscar.component.scss']
})
export class CartComponent {

  constructor(private cart: CartService) {}

  getProductList() {
    return this.cart.cart;
  }
}
