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

  allAtributeSelection: {
    categoryName : string,
    attributes: ProductAttribute []
    attributesSelected: ProductAttribute | undefined
  }[] = []

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
        this.status = "ok"

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

        data.productAttributes.forEach(attribute => {
          if(attribute.photoUrl != undefined || attribute.photoUrl != null || attribute.photoUrl == ""){
            this.imgService.downloadImagem(attribute.photoUrl).subscribe({
              next: (imageBlob) => {

                let img = this.sanitizer.bypassSecurityTrustUrl(
                  URL.createObjectURL(imageBlob)
                )
                attribute.photoObject = img
                this.productImages.push(img);
              },
            });
          }
        })

        this.getAllCategoryAttribute().forEach(category => {

          let numberSelection = 0

          this.getAllAttributeFromCategory(category).forEach(attribute => {
            if(attribute.numberSelection > numberSelection){
              numberSelection = attribute.numberSelection
            }
          })

          let counter = 0

          do {
            counter++;
            this.allAtributeSelection.push({
              categoryName: `${counter > 1 ? (counter + " " + category) : category}`,
              attributes: this.getAllAttributeFromCategory(category),
              attributesSelected: undefined
            })
          } while (counter < numberSelection)

        })

      },
      error: (err: HttpErrorResponse) => {
        //this.status = "fracassado"
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

  getAttributeSelect(){

    let attrs: (ProductAttribute)[] = []

    this.allAtributeSelection.filter(attr => attr.attributesSelected != undefined).forEach(attr => {
      if(attr.attributesSelected != undefined){
        attrs.push(attr.attributesSelected)
      }
    })

    return attrs
  }

  addToNewCart() {

    this.cartNewItems[0] = {
      date: new Date().toLocaleDateString('en-Us'),
      checked: true,
      product: this.product,
      quantity: this.counter,
      productAttributes: [...this.getAttributeSelect()]
    };
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

    this.getAttributeSelect().forEach(attr => value += attr.attributePrice)

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

    this.allAtributeSelection.filter(attr => attr.attributesSelected != undefined).forEach(attr => {
      value += attr.attributesSelected?.attributePrice ?? 0
    })

    return value
  }

  setImagePreviw(attr: ProductAttribute){
    if(attr.photoObject != undefined && attr.photoObject != null && attr.photoObject){
      this.productImagePreview = attr.photoObject
    } else {
      this.productImagePreview = this.product.photoObject
    }
  }
}
