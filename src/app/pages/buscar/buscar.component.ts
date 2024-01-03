import { ImageService } from './../../services/imgService/img-service.service';
import { ProductService } from './../../services/product/product.service';
import { CartService } from '../../services/cart/cart.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/model/product.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.scss'],
})
export class BuscarComponent implements OnInit {
  sideActive = false;

  toogleActive() {
    this.sideActive = !this.sideActive;
  }

  products: Product[] = [];

  constructor(
    private router: Router,
    private cart: CartService,
    private ps: ProductService,
    private imgService: ImageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.ps.getAll().subscribe((data) => {
      this.products = data;

      data.forEach((product) => {
        this.imgService.downloadImagem(product.photoUrl).subscribe({
          next: (imageBlob) => {
            product.photoObject = this.sanitizer.bypassSecurityTrustUrl(
              URL.createObjectURL(imageBlob)
            );
          },
        });
      });
    });
  }

  viewItem(item: string) {
    setTimeout(() => {
      this.router.navigate([`m/item/${item}`]);
    }, 200);
  }

  getProductList() {
    return this.cart.cart;
  }

  getCartLength() {
    return this.cart.cart.length;
  }
}
