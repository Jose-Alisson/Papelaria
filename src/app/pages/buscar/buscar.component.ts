import { CartService } from '../../services/cart/cart.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.scss'],
})
export class BuscarComponent {
  sideActive = false;

  toogleActive() {
    this.sideActive = !this.sideActive;
  }

  constructor(private router: Router,private cart: CartService) {}

  viewItem(item: number) {

    setTimeout(() => {
      this.router.navigate([`m/item/${item}`]);
    }, 200);
  }

  getProductList(){
    return this.cart.cart
  }

  getCartLength(){
    return this.cart.cart.length
  }
}
