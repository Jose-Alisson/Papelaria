import { Attribute, Component, OnInit } from '@angular/core';
import { Amount } from 'src/app/model/amount.model';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss', '../buscar/buscar.component.scss'],
})
export class CartComponent implements OnInit {

  constructor(private cart: CartService) {}

  ngOnInit(): void {
    this.cart.cartNewItems = 0
  }

  /*
  Paga as tadas diferentes entre os produtos e armazena em uma lista
  */
  getAllDateProducts() {
    const datasUnicasSet = new Set<string>();
    this.cart.cart.forEach((data) => datasUnicasSet.add(data.date));
    const datasUnicas: string[] = Array.from(datasUnicasSet);
    return datasUnicas;
  }

  /*
  Filtra os amontoados pela data
  */
  getAllProductFromDate(date: string) {
    return this.cart.cart.filter((amount) => amount.date === date);
  }

  /*
  Ativa ou desativa o verificado dos amontodos para uma filtragem posterior
  */
  checkedAll(date: string, checked: boolean) {
    this.cart.chekedAllDate(date, checked);
  }

  /*
  Exibe no console o objeto
  */
  printObject(any: any) {
    console.log(any);
  }

  /*
  Pegar todos os amontuadores do carrinho
  */
  getAllProductFromCart(){
    return this.cart.cart
  }

  /*
  Retorna true se todos os amontoados da data especifica estiverem ativos
  */
  isCheckAllActiveDate(date: string) {
    let active = true;

    this.cart.cart
      .filter((amount) => amount.date === date)
      .forEach((amount) => {
        if (amount.checked === false) {
          active = false;
        }
      });

    return active;
  }

  /*
  Incrementar ao amontuador
  */
  increment(amount: Amount) {
    if(amount.quantity < amount.product.available){
      amount.quantity++;
    }
  }

  /*
  Decrementar ao amontuador e remover o amonduador caso o valor de decrementação for menor que 1
  */
  decrement(amount: Amount) {
    if (amount.quantity > 1) {
      amount.quantity--;
    } else {
      this.cart.cart = this.cart.cart.filter(amount_ => amount_ !== amount)
    }
  }

  /*
   */
  getCartLengthAmountCheck() {
    return this.cart.cart.filter((amount) => amount.checked === true).length;
  }

  /*
  Retorna o total do amontuador
  */
  getTotalAmount(amount: Amount) {
    let value = 0;

    value = amount.product.basePrice;

    amount.productAttributes.forEach(attribute => {
      value += attribute.attributePrice
    })

    value *= amount.quantity

    return value;
  }

  getAllTotalAmountCheck() {
    let value = 0;

    this.cart.cart
      .filter((amount) => amount.checked === true)
      .forEach((amount) => {
        value += this.getTotalAmount(amount);
      });

    return value;
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
