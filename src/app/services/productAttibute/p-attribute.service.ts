import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UrlApiService } from '../urlApi/url-api.service';
import { ProductAttribute } from 'src/app/model/ProductAttribute.model';

@Injectable({
  providedIn: 'root'
})
export class PAttributeService {

  private http = inject(HttpClient)

  constructor(){}

  save(attr: ProductAttribute){
    return this.http.post<ProductAttribute>(`${UrlApiService.URL_API}/product/attribute/save`, attr)
  }

  delete(id: string) {
    return this.http.delete(`${UrlApiService.URL_API}/product/attribute/delete/${id}`)
  }

  findByProductId(id: string){
    return this.http.get<ProductAttribute[]>(`${UrlApiService.URL_API}/product/attribute/findAllByProductId/${id}`)
  }
}
