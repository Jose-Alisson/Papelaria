import { ImageService } from './../../services/imgService/img-service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ProductService } from './../../services/product/product.service';
import { Component, ViewChild, ElementRef, OnInit, Attribute, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/model/product.model';
import { CartService } from 'src/app/services/cart/cart.service';
import { Amount } from 'src/app/model/amount.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductAttribute } from 'src/app/model/ProductAttribute.model';
import { AttributeManagerComponent } from 'src/app/shared/comp/attribute-manager/attribute-manager.component';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss', '../buscar/buscar.component.scss'],
})
export class ItemComponent implements OnInit, AfterViewInit {

  status = "ok"

  productImagePreview: SafeUrl = {}

  productImages: SafeUrl[] = []

  product: Product = {
    id: '1',
    photoObject: {},
    productName: 'Produto',
    description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero, delectus at sit ad vero expedita fuga enim numquam possimus. Eos harum impedit qui nesciunt tenetur.`,
    basePrice: 10,
    category: 'Presente',
    photoUrl: '',
    available: 10,
    productAttributes: [],
    allDescription: ''
  };


  @ViewChild('attributes')
  attributeManager!: AttributeManagerComponent

  counter = 1;

  sideActive = false;

  cartNewItems: Amount[] = [
    {
      date: new Date().toLocaleDateString('en-Us'),
      checked: true,
      product: this.product,
      quantity: this.counter,
      productAttributes: []
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

  @ViewChild('description')
  description!: ElementRef<HTMLDivElement>

  ngAfterViewInit(): void {
    this.description.nativeElement.innerHTML = this.product.allDescription
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getFindById(id ?? '').subscribe({
      next: (data) => {
        this.product = data;

        console.log(this.attributeManager)

        if(this.attributeManager){
          this.attributeManager?.autoFind(this.product)
        }


        if(data === null){
          this.status = "notFound"
          return
        } else {
          this.status = "ok"
        }

        if(this.description){
          this.description.nativeElement.innerHTML = this.product.allDescription
        }

        this.imgService.downloadImagem(data.photoUrl).subscribe({
          next: (imageBlob) => {

            let img = this.sanitizer.bypassSecurityTrustUrl(
              URL.createObjectURL(imageBlob)
            );

            this.product.photoObject = img;
            this.productImagePreview = img;
            this.productImages.push(img)
          },
        });
      },
      error: (err: HttpErrorResponse) => {
        if(err.status === 404){
          this.status = "notFound"
        }
      }
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
      quantity: this.counter,
      productAttributes: []
    };

    console.log(this.cartNewItems[0])
  }

  addToCart() {
    this.cart.cart = [...this.cart.cart, ...this.cartNewItems];
    this.cart.cartNewItems += this.cartNewItems.length;
    this.cartNewItems = [];
    this.sideActive = false
  }

  incrementInCart(amonut: Amount) {
    if (amonut.quantity < amonut.product.available) {
      amonut.quantity++;
    }
  }

  decrementInCart(amount: Amount) {
    if (amount.quantity > 1) {
      amount.quantity--;
    } else {
      this.cartNewItems = this.cartNewItems.filter(
        (amount_) => amount_ !== amount
      );
    }
  }

  getTotalAmount(amount: Amount) {
    let value = 0;

    value += amount.product.basePrice

    value = value * amount.quantity;

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

  showProduct(id: number){
    this.router.navigate([`/m/item/${id}`])
  }

  setPreviewImage(img: SafeUrl){
    this.productImagePreview = img
  }

  getAllCategoryAttribute() {
    const categoriaUnicasSet = new Set<string>();
    this.product.productAttributes.forEach((data) => categoriaUnicasSet.add(data.attributeCategory));
    const datasUnicas: string[] = Array.from(categoriaUnicasSet);
    return datasUnicas;
  }

  getAllAttributeFromCategory(category: string) {
    return this.product.productAttributes.filter((attribute) => attribute.attributeCategory === category);
  }

  getSize(size: number){
    return Array.from({ length: size }, (_, index) => index)
  }

  getProductPriceWithAttr(){
    let value = this.product.basePrice

    return value
  }

  setImagePreviw(attr: ProductAttribute){
    if(attr.photoObject != undefined && attr.photoObject != null && attr.photoObject){
      this.productImagePreview = attr.photoObject
    } else {
      this.productImagePreview = this.product.photoObject
    }
  }

  getProductSelectedAttribute(amount: Amount){
    let str = ""
    amount.productAttributes.forEach((attribute, index, array) => {
      str += attribute.attributeName

      if(index + 1 < array.length){
        str += " + "
      }
    })

    return str
  }
}
