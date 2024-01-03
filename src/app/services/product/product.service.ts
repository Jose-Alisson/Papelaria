import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Product } from 'src/app/model/product.model';
import { UrlApiService } from '../urlApi/url-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  constructor(private http:  HttpClient) { }

  getFindById(id: string){
    return this.http.get<Product>(`${UrlApiService.URL_API}/product/findById/${id}`)
  }

  getAll(){
    return this.http.get<Product[]>(`${UrlApiService.URL_API}/product/findAll`)
  }
}
