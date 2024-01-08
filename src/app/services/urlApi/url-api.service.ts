import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlApiService {

  static URL_API = "http://192.168.196:8080/api"

  constructor() { }
}
