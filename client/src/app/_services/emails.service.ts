import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class EmailsService {

  constructor(private http: HttpClient) {
  }

  addEmail(email): Observable<string> {
    return this.http.post<string>(`http://localhost:4000/subscribers/addemail`, email);
  }


}
