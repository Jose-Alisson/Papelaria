import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  sideActive = false;

  toogleActive() {
    this.sideActive = !this.sideActive;
  }

  constructor(private router: Router) {}

  viewItem(item: number) {

    setTimeout(() => {
      this.router.navigate([`item/${item}`]);
    }, 200);
  }
}
