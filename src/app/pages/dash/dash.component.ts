import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AccountService } from 'src/app/services/account/account.service';
import { CartService } from 'src/app/services/cart/cart.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})
export class DashComponent implements OnInit {
  menuActive = false;

  @ViewChild('initialText', { static: true })
  initialText!: ElementRef<HTMLElement>;

  constructor(
    private account: AccountService,
    private router: Router,
    private viewportScroller: ViewportScroller,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
  }

  getnNewAmount(){
    return this.cartService.cartNewItems
  }

  saibaMais() {
    this.initialText.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  toogleActive() {
    this.menuActive = !this.menuActive;
  }

  products: any[] = [
    {
      photoUrl: 'assets//foto_casamento.jpg',
      name: 'Álbum de fotos',
      price: 20.0,
      description: 'Álbum de foto feito á mão',
      article: ' a ',
    },
    {
      photoUrl: 'assets//luluzinho.jpg',
      name: 'Luluzinho',
      price: 5.0,
      description: 'Prendedor de cabelo',
      article: ' o ',
    },
  ];

  comprar(message: string) {
    const numeroContato = '+5581999340962'; // Insira o número do seu contato do WhatsApp aqui
    const mensagem = encodeURIComponent(message); // Codificar a mensagem para evitar problemas de URL

    const url = `https://api.whatsapp.com/send?phone=${numeroContato}&text=${mensagem}`;
    window.open(url);
  }

  getAccount() {
    return this.account.account;
  }
}
