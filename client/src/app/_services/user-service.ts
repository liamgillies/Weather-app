import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  register(user): Observable<void> {
    return this.http.post<void>(`http://localhost:4000/users/register`, user);
  }

  addLocation(userLocation, id): Observable<void> {
    return this.http.post<void>(`http://localhost:4000/users/addLocation`, {location: userLocation, _id: id});
  }

  deleteLocation(count, id): Observable<void> {
    return this.http.post<void>(`http://localhost:4000/users/removeLocation`, {index: count, _id: id});
  }

}
