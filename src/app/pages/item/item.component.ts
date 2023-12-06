import { Component } from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss', '../cart/cart.component.scss']
})
export class ItemComponent {

  counter = 1

  sideActive = false;

  toogleActive() {
    this.sideActive = !this.sideActive
  }

  increment(){
    this.counter++;
  }

  decrement(){
    if(this.counter > 1){
      this.counter--;
    }
  }
}
