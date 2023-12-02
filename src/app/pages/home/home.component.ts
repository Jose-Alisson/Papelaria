import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  menuActive = false

  @ViewChild('initialText', {static: true})
  initialText!: ElementRef<HTMLElement>

  saibaMais(){
    this.initialText.nativeElement.scrollIntoView({behavior: 'smooth'})
  }

  toogleActive(){
    this.menuActive = !this.menuActive
  }

  products: any[] = [
    {
      photoUrl: 'assets//foto_casamento.jpg',
      name: 'Álbum de fotos',
      price: 20.0,
      description: 'Álbum de foto feito á mão',
      article: ' a '
    },
    {
      photoUrl: 'assets//luluzinho.jpg',
      name: 'Luluzinho',
      price: 5.0,
      description: 'Prendedor de cabelo',
      article: ' o '
    }
  ]

  comprar(message: string){
    const numeroContato = '+5581999340962'; // Insira o número do seu contato do WhatsApp aqui
    const mensagem = encodeURIComponent(message); // Codificar a mensagem para evitar problemas de URL

    const url = `https://api.whatsapp.com/send?phone=${numeroContato}&text=${mensagem}`;
    window.open(url);
  }
}
