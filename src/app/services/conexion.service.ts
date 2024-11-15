import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConexionService {

  public api = 'http://127.0.0.1:8000/api/';

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  };

  constructor(public http: HttpClient) {
  }

  post(model: string, data: any) {
    return this.http.post(this.api + model, data);
  }

  put(model: string, data: any) {
    return this.http.put(this.api + model, data);
  }

  get(model: string) {
    return this.http.get(this.api + model);
  }

  delete(model: string) {
    return this.http.delete(this.api + model);
  }
}
