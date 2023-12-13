import { ImageService } from './../../services/imgService/img-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ProductService } from './../../services/product/product.service';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/model/product.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { Amount } from 'src/app/model/amount.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss', '../buscar/buscar.component.scss'],
})
export class ItemComponent implements OnInit {
  product: Product = {
    id: '1',
    photoObject: {},
    productName: 'Produto',
    description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero, delectus at sit ad vero expedita fuga enim numquam possimus. Eos harum impedit qui nesciunt tenetur.`,
    price: 10,
    category: 'Presente',
    photoUrl: '',
    available: 10,
  };

  counter = 1;

  sideActive = false;

  cartNewItems: Amount[] = [
    {
      date: new Date().toLocaleDateString('en-Us'),
      checked: true,
      product: this.product,
      amount: this.counter,
    },
  ];

  toogleActive() {
    this.sideActive = !this.sideActive;
  }

  constructor(
    private cart: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private sanitizer: DomSanitizer,
    private imgService: ImageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getFindById(parseInt(id ?? '0')).subscribe({
      next: (data) => {
        this.product = data;
        this.imgService.downloadImagem(data.photoUrl).subscribe({
          next: (imageBlob) => {
            this.product.photoObject = this.sanitizer.bypassSecurityTrustUrl(
              URL.createObjectURL(imageBlob)
            );
          },
        });
      },
    });
  }

  increment() {
    if (this.counter < this.product.available) {
      this.counter++;
    }
  }

  getProductList() {
    return this.cartNewItems;
  }

  decrement() {
    if (this.counter > 1) {
      this.counter--;
    }
  }

  getCartLength() {
    return this.cart.cart.length;
  }

  addToNewCart() {
    this.cartNewItems[0] = {
      date: new Date().toLocaleDateString('en-Us'),
      checked: true,
      product: this.product,
      amount: this.counter,
    };
  }

  addToCart() {
    this.cart.cart = [...this.cart.cart, ...this.cartNewItems];
    this.cart.cartNewItems += this.cartNewItems.length;
    this.cartNewItems = [];
  }

  incrementInCart(amonut: Amount) {
    if (amonut.amount < amonut.product.available) {
      amonut.amount++;
    }
  }

  decrementInCart(amount: Amount) {
    if (amount.amount > 1) {
      amount.amount--;
    } else {
      this.cartNewItems = this.cartNewItems.filter(
        (amount_) => amount_ !== amount
      );
    }
  }

  getTotalAmount(amount: Amount) {
    let value = 0;

    value = amount.product.price * amount.amount;

    return value;
  }

  getAllTotalAmounts() {
    let value = 0;

    this.cartNewItems.forEach((amount) => {
      value += this.getTotalAmount(amount);
    });

    return value;
  }

  getCartNewItemsLength() {
    return this.cartNewItems.length;
  }
}
