import { Address } from 'src/app/model/address.model';
import { AmountService } from './../../services/amount/amount.service';
import { Attribute, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Amount } from 'src/app/model/amount.model';
import { Order } from 'src/app/model/order.model';
import { AccountService } from 'src/app/services/account/account.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { OrderService } from 'src/app/services/order/order.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { Payment } from 'src/app/model/payment.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss', '../buscar/buscar.component.scss'],
})
export class CartComponent implements OnInit {
  private as = inject(AmountService);
  private os = inject(OrderService);
  private accS = inject(AccountService);
  private payS = inject(PaymentService);
  private router = inject(Router);

  addressSelected: Address | null = null;

  constructor(private cart: CartService) {}

  ngOnInit(): void {
    this.cart.cartNewItems = 0;

    this.cart.loadCart();
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
  getAllProductFromCart() {
    return this.cart.cart;
  }

  /*
  Incrementar ao amontuador
  */
  increment(amount: Amount) {
    if (amount.quantity < amount.product.available) {
      //amount.quantity++;
      this.as.increment(amount.id).subscribe((data) => {
        amount.quantity = data;
      });
    }
  }

  delete(id: string) {
    this.as.delete(id).subscribe(() => {
      this.cart.cart = this.cart.cart.filter((amount_) => amount_.id !== id);
    });
  }

  /*
  Decrementar ao amontuador e remover o amonduador caso o valor de decrementação for menor que 1
  */
  decrement(amount: Amount) {
    if (amount.quantity > 1) {
      //amount.quantity--;
      this.as.decrement(amount.id).subscribe((data) => {
        amount.quantity = data;
      });
    } else {
      this.delete(amount.id);
    }
  }

  /*
  Retorna o total do amontuador
  */
  getTotalAmount(amount: Amount) {
    let value = 0;

    value = amount.product.basePrice;

    amount.productAttributes.forEach((attribute) => {
      value += attribute.attributePrice;
    });

    value *= amount.quantity;

    return value;
  }

  getAllTotalAmountCheck() {
    let value = 0;

    this.cart.cart.forEach((amount) => {
      value += this.getTotalAmount(amount);
    });

    return value;
  }

  getProductSelectedAttribute(amount: Amount) {
    let str = '';
    amount.productAttributes.forEach((attribute, index, array) => {
      str += attribute.attributeName;

      if (index + 1 < array.length) {
        str += ' + ';
      }
    });

    return str;
  }

  finalizarComprar() {
    if (this.accS.account) {
      let payment: Payment = {
        id: '',
        status: 'NAO_PAGO',
        typePay: 'NAO_DEFINIDO',
        value: this.getAllTotalAmountCheck(),
        account: this.accS.account,
      };

      this.payS.criarPagament(payment).subscribe((pay) => {

        let order: Order = {
          id: '',
          account: this.accS.account!,
          amounts: this.cart.cart,
          status: 'CRIADO',
          dateCriation: new Date(),
          address: this.addressSelected,
          payment: pay,
        };

        this.os.create(order).subscribe((data) => {
          this.router.navigate(['/m/pedidos']);
        });
      });
    }
  }
}
