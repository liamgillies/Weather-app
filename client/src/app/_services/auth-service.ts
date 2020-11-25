import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../_models/user';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'any'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  constructor(private http: HttpClient,
              private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public getCurrentUserValue(): User {
    return this.currentUserSubject.value;
  }

  register(user): Observable<void> {
    return this.http.post<void>(`http://localhost:4000/users/register`, user);
  }

  login({username, password}): Observable<User> {
    return this.http.post<any>(`http://localhost:4000/users/authenticate`, {username, password})
      .pipe(map(user => {
        console.log(`user ${user}`);
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  addLocation(location): void {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    user.savedLocations.push(location);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  removeLocation(count: number): void {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    user.savedLocations.splice(count, 1);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
