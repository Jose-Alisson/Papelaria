import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlApiService {

  static URL_API = "http://localhost:8080/api"

  constructor() { }
}
