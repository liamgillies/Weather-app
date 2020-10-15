import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class EmailsService {

  constructor(private http: HttpClient) {
  }

  addEmail(email): Observable<void> {
    return this.http.post<void>(`http://localhost:4000/subscribers/addemail`, email);
  }


}
