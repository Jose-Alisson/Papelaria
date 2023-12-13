import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Product } from 'src/app/model/product.model';
import { UrlApiService } from '../urlApi/url-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  constructor(private http:  HttpClient) { }

  getFindById(id: number){
    return this.http.get<Product>(`${UrlApiService.URL_API}/findById/${id}`)
  }
}
