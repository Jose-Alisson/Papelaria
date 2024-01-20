import { Amount } from 'src/app/model/amount.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlApiService } from '../urlApi/url-api.service';

@Injectable({
  providedIn: 'root'
})
export class AmountService {

  constructor(private http: HttpClient) { }

  save(amount: Amount){
    return this.http.post<Amount>(`${UrlApiService.URL_API}/amounts/save`, amount)
  }

  delete(id: string){
    return this.http.delete<void>(`${UrlApiService.URL_API}/amounts/delete/${id}`)
  }

  increment(id: string){
    return this.http.patch<number>(`${UrlApiService.URL_API}/amounts/increment/${id}`, {})
  }

  decrement(id: string){
    return this.http.patch<number>(`${UrlApiService.URL_API}/amounts/decrement/${id}`, {})
  }

  findAllByUserId(id: string){
    let params = new HttpParams().append("userId", id)
    return this.http.get<Amount[]>(`${UrlApiService.URL_API}/amounts/all`, {params : params})
  }
}
