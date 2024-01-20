import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Payment } from 'src/app/model/payment.model';
import { UrlApiService } from '../urlApi/url-api.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private http = inject(HttpClient)

  constructor() { }

  criarPagament(pay: Payment){
    return this.http.post<Payment>(`${UrlApiService.URL_API}/pays/createPay`, pay)
  }

  setTypePay(type : string, id : string){
    let parms = new HttpParams().append("type_pay", type)
    return this.http.patch<void>(`${UrlApiService.URL_API}/pays/${id}/setTypePay`, {}, {params: parms})
  }
}
