import { Injectable, OnInit, inject } from '@angular/core';
import { Amount } from 'src/app/model/amount.model';
import { Product } from 'src/app/model/product.model';
import { AmountService } from '../amount/amount.service';
import { AccountService } from '../account/account.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageService } from '../imgService/img-service.service';

@Injectable({
  providedIn: 'root',
})
export class CartService implements OnInit{

  cartNewItems = 0

  cart: Amount[] = [];

  private amountS = inject(AmountService)
  private as = inject(AccountService)
  private imgS = inject(ImageService)
  private sanitizer = inject(DomSanitizer)

  constructor() {}

  ngOnInit(): void {}

  loadCart(){
    if(this.as.account){
      this.amountS.findAllByUserId(this.as.account.id).subscribe(data => {
        this.cart = data

        data.forEach(amount => {
          this.imgS.downloadImagem(amount.product.photoUrl).subscribe(blob => {
            amount.product.photoObject = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob))
          })
        })
      })
    }
  }
}
