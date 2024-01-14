import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { UrlApiService } from '../urlApi/url-api.service';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}

  uploadImage(file: File | null) {
    if (file) {
      let form = new FormData();
      form.append('file', file, file.name);

      const headers = new HttpHeaders({
        enctype: 'multipart/form-data',
        Accept: 'application/json',
      });

      const options = { headers: headers };

      return this.http.post<any>(
        UrlApiService.URL_API + '/file/upload',
        form,
        options
      ).pipe(catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error));
      }))
    }

    throw new Error('Arquivo Nulo');
  }

  downloadImagem(path: string): Observable<Blob> {
    if (path !== '' && path !== 'null' && path !==  null) {
      const params = new HttpParams().set('filePath', path);
      return this.http.get(UrlApiService.URL_API + '/file/download', {
        params: params,
        responseType: 'blob',
      });
    }


    console.error('path vazio');
    return of();
  }
}
