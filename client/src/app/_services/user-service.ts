import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  // saved locations page
  addLocation(userLocation, id): Observable<void> {
    return this.http.post<void>(`http://localhost:4000/users/addLocation`, {location: userLocation, _id: id});
  }

  deleteLocation(count, id): Observable<void> {
    return this.http.post<void>(`http://localhost:4000/users/removeLocation`, {index: count, _id: id});
  }

  // about page
  addComment(text, userID): Observable<void> {
    return this.http.post<void>(`http://localhost:4000/users/addComment`, {comment: text, _id: userID});
  }

  getBaseComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`http://localhost:4000/users/getComments`);
  }

  getUserComments(userID: string): Observable<string[]> {
    return this.http.post<string[]>(`http://localhost:4000/users/getUserComments`, {_id: userID});
  }

  deleteComment(commentID): Observable<void> {
    return this.http.delete<void>(`http://localhost:4000/users/deleteComment/${commentID}`);
  }

  like(cID, uID): Observable<void> {
    return this.http.post<void>(`http://localhost:4000/users/like`, {commentID: cID, userID: uID});
  }

  dislike(cID, uID): Observable<void> {
    return this.http.post<void>(`http://localhost:4000/users/dislike`, {commentID: cID, userID: uID});
  }

  addReply(cID, uID, text): Observable<Comment> {
    return this.http.post<Comment>(`http://localhost:4000/users/addReply`, {commentID: cID, userID: uID, comment: text});
  }

  deleteReply(replyID): Observable<void> {
    return this.http.delete<void>(`http://localhost:4000/users/deleteReply/${replyID}`);
  }
}
