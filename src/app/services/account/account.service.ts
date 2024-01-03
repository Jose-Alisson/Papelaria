import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account } from 'src/app/model/account.model';
import { UrlApiService } from '../urlApi/url-api.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {

  account?: Account | undefined = 


  {
    id: '',
    photoUrl: '',
    email: 'JoseAlisson@gmail.com',
    name: 'Alisson',
    password: '',
    phone: '(81) 9 73127515',
    photo: '',
    typeAccount : 'ADMIN',
    tokenAccess : ''
  };

  constructor(private http: HttpClient) {}

  signIn(email: string, password: string) {
    return this.http.post<Account>(UrlApiService.URL_API + '/auth/login', {email: email, password: password}, {})
  }

  signInSetAccount(email: string, password: string){
    return this.http.
    post<Account>(UrlApiService.URL_API + '/auth/login',
    {email: email, password: password}, {}).pipe(tap(data => {
      this.account = data
      localStorage.setItem('tokenAccess', data.tokenAccess)
    }))
  }

  signOut() {
    this.account = undefined;
    localStorage.removeItem('tokenAccess')
  }

  autoSign(){
    return this.http.
    post<Account>(UrlApiService.URL_API + '/auth/login',
    {tokenAccess : localStorage.getItem('tokenAccess')}, {}).
    pipe(tap(data => {
      this.account = data
    }))
  }

  save(account: Account){
    return this.http.post<Account>(UrlApiService.URL_API + '/account/save', account, {})
  }
}
