import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.scss', '../cart/cart.component.scss']
})
export class ProductManagerComponent implements OnInit{

  constructor(private act: ActivatedRoute){}

  ngOnInit(): void {}
}
