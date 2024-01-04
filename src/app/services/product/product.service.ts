import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Product } from 'src/app/model/product.model';
import { UrlApiService } from '../urlApi/url-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  constructor(private http:  HttpClient) { }

  save(product : Product){
    return this.http.post<Product>(`${UrlApiService.URL_API}/product/save`, product)
  }

  delete(id: string){
    return this.http.delete<any>(`${UrlApiService.URL_API}/product/delete/${id}`)
  }

  getFindById(id: string){
    return this.http.get<Product>(`${UrlApiService.URL_API}/product/findById/${id}`)
  }

  getAll(){
    return this.http.get<Product[]>(`${UrlApiService.URL_API}/product/findAll`)
  }
}
