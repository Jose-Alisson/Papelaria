import { CartService } from './services/cart/cart.service';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { AccountService } from './services/account/account.service';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderService } from './services/order/order.service';
import { AddressService } from './services/address/address.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private cs = inject(CartService)
  private os = inject(OrderService)
  private addS = inject(AddressService)

  constructor(private as: AccountService){}

  ngOnInit(): void {
    this.as.autoSign().subscribe({ next: () => {
      this.cs.loadCart()
      this.os.loadOrders()
      this.addS.loadAddresses()

    }, error: (err: HttpErrorResponse) => {
      console.log(err);
    }})
  }

  comprar(message: string){
    const numeroContato = '+5581999340962'; // Insira o número do seu contato do WhatsApp aqui
    const mensagem = encodeURIComponent(message); // Codificar a mensagem para evitar problemas de URL

    const url = `https://api.whatsapp.com/send?phone=${numeroContato}&text=${mensagem}`;
    window.open(url);
  }
}
