import { Injectable } from '@angular/core';
import { Account } from 'src/app/model/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  account?: Account | undefined = {
    id: '',
    email: 'JoseAlisson@gmail.com',
    name: 'Alisson',
    password: '',
    phone: '(81) 9 73127515',
    photo: ''
  }

  constructor() { }

  signOut(){
    this.account = undefined
  }
}
