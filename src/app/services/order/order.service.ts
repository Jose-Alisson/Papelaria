import { ImageService } from 'src/app/services/imgService/img-service.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Order } from 'src/app/model/order.model';
import { UrlApiService } from '../urlApi/url-api.service';
import { AccountService } from '../account/account.service';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orders: Order[] = []

  private accS = inject(AccountService)
  private imgS = inject(ImageService)
  private sanitizer = inject(DomSanitizer)

  constructor(private http: HttpClient) {}

  create(order: Order){
    return this.http.post<Order>(`${UrlApiService.URL_API}/orders/create`, order)
  }

  save(order: Order){
    return this.http.post<Order>(`${UrlApiService.URL_API}/orders/save`, order)
  }

  findAllByUserId(id: string) {
    let params = new HttpParams().append("id", id)
    return this.http.get<Order[]>(`${UrlApiService.URL_API}/orders/byUserId`, {params : params})
  }

  delete(id: string){
    return this.http.delete(`${UrlApiService.URL_API}/orders/delete/${id}`)
  }

  loadOrders(){
    this.findAllByUserId(this.accS.account?.id ?? '').pipe(map(lista => lista.map(item => ({...item, dateCriation: new Date(item.dateCriation)})))).subscribe((data) => {
      this.orders = this.ordernarPedidos(data);

      this.orders.forEach(order => {
        order.amounts.forEach(amount => {
          this.imgS.downloadImagem(amount.product.photoUrl).subscribe(blob => {
            amount.product.photoObject  = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob))
          })
        })
      })
    });
  }

  ordernarPedidos(orders: Order[]) {
    orders.sort((a, b) => b.dateCriation.getTime() - a.dateCriation.getTime())
    return orders;
  }
}
