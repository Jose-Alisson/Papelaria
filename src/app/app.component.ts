import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AccountService } from './services/account/account.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private as: AccountService){}

  ngOnInit(): void {
    this.as.autoSign().subscribe({ next: () => {

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
