import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Granja-Nascimento-Angular';

  menuActive = false

  toogleActive(){
    this.menuActive = !this.menuActive
  }

  products: any[] = [
    {
      photoUrl: 'assets//images-13.jpg',
      name: 'Bandeja de ovos de codorna',
      price: 5.50,
      description: 'Bandeja com 30 ovos',
      article: ' a '
    },
    {
      photoUrl: 'assets//images-14.jpg',
      name: 'Bandejão de ovos de galinha caipira',
      price: 14.50,
      description: 'Bandeja com 30 ovos',
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
