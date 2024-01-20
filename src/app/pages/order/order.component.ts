import { Payment } from 'src/app/model/payment.model';

import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Amount } from 'src/app/model/amount.model';
import { Order } from 'src/app/model/order.model';
import { AccountService } from 'src/app/services/account/account.service';
import { OrderService } from 'src/app/services/order/order.service';
import { PaymentService } from 'src/app/services/payment/payment.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['../buscar/buscar.component.scss', './order.component.scss'],
})
export class OrderComponent implements OnInit {
  private router = inject(ActivatedRoute);
  os = inject(OrderService);
  private accS = inject(AccountService);
  private ps = inject(PaymentService);

  id = '';

  constructor() {}

  ngOnInit(): void {
    this.os.loadOrders();
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

  getProductPriceWithAttr(amount: Amount) {
    let value = amount.product.basePrice;
    amount.productAttributes.forEach((attr) => {
      value += attr.attributePrice;
    });
    value *= amount.quantity;
    return value;
  }

  deleteOrder(id: string) {
    this.os.delete(id).subscribe(() => {
      this.os.orders = this.os.orders.filter((order) => order.id != id);
    });
  }

  getTotal(order: Order) {
    let valor_ = 0;

    order.amounts.forEach((amount) => {
      let valor = amount.product.basePrice;

      amount.productAttributes.forEach((attr) => {
        valor += attr.attributePrice;
      });

      valor *= amount.quantity;

      valor_ += valor;
    });

    return valor_;
  }

  definirPagamento(pay: Payment | null, type: string) {
    if (pay) {
      this.ps.setTypePay(type, pay.id).subscribe((data) => {
        pay.typePay = type;
      });
    }
  }
}
