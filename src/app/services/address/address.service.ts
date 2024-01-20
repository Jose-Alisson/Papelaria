import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { max } from 'rxjs';
import { UrlApiService } from '../urlApi/url-api.service';
import { Address } from 'src/app/model/address.model';
import { AccountService } from '../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  taxas = [
    {max : 200, value : 0},
    {max : 1500 , value : 3},
    {max : 3500 , value : 4},
    {max : 4500 , value : 5},
  ]

  addresses: Address[] = []

  private as = inject(AccountService)

  constructor(private http: HttpClient) {}

  findAddress(cep : string){
    let params = new HttpParams().append("origin" , "51340720").append("destination", cep)
    return this.http.get<any>(`${UrlApiService.URL_API}/addresses/distance`, {params: params})
  }

  findAllByUserId(id: string){
    let params = new HttpParams().append("id", id)
    return this.http.get<Address[]>(`${UrlApiService.URL_API}/addresses/ByUserId`, {params: params})
  }

  loadAddresses() {
    this.findAllByUserId(this.as.account?.id ?? '').subscribe(data => {
      this.addresses = data
    })
  }

  getTaxa(distance : number){
    let value = 0
    for(let i = 0; i < this.taxas.length;i++){
      let taxa = this.taxas[i]
      if(distance <= taxa.max){
        value = taxa.value
        break;
      }
    }
    return value
  }
}
