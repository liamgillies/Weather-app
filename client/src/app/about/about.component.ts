import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../_services/auth-service';
import {UserService} from '../_services/user-service';
import {Comment} from '../_models/comment';
import {User} from "../_models/user";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  commentForm = new FormGroup({
    comment: new FormControl('', [Validators.required, Validators.minLength(1)])
  });
  public loggedIn: boolean;
  public submitted = false;
  public baseComments = [];
  public userComments: string[] = [];
  public currentUser: User;
  public likeFlag = true;
  public dislikeFlag = true;
  constructor(private authService: AuthService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.loadBaseComments();
    this.loggedIn = this.authService.getCurrentUserValue() != null;
    this.currentUser = this.authService.getCurrentUserValue();
  }

  loadBaseComments(): void {
    this.userService.getBaseComments().subscribe(res => {
      this.baseComments = res;

      this.loadUserComments().then(() => {
        this.baseComments.forEach(comment => {
          this.userComments.forEach(id => {
            if (id === comment._id) {
              comment.own = true;
            }
          });
        });
      });
    });
  }

   loadUserComments(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.userService.getUserComments(this.currentUser._id).subscribe(res => {
        this.userComments = res;
        resolve();
      });
    });
  }

  like(comment: Comment): void {
    this.userService.like(comment._id, this.currentUser._id).subscribe(() => {
      // if already liked
      // @ts-ignore
      if (localStorage.getItem(comment._id) === 'liked' || (comment.usersLiked.includes(this.currentUser._id) && !comment.likeFlag)) {
        localStorage.removeItem(comment._id);
        comment.likes--;
        comment.likeFlag = true;
      }
      else {
        // removes dislike
        // @ts-ignore
        if (localStorage.getItem(comment._id) === 'disliked' || (comment.usersDisliked.includes(this.currentUser._id) && !comment.likeFlag)) {
          localStorage.removeItem(comment._id);
          comment.dislikes--;
          comment.dislikeFlag = true;
        }
        localStorage.setItem(comment._id, 'liked');
        comment.likes++;
      }
      comment.likeFlag = true;
    });
  }

  dislike(comment: Comment): void {
    this.userService.dislike(comment._id, this.currentUser._id).subscribe(() => {
      // if already dislikes
      // @ts-ignore
      if (localStorage.getItem(comment._id) === 'disliked' || (comment.usersDisliked.includes(this.currentUser._id)
        && !comment.dislikeFlag)) {
        localStorage.removeItem(comment._id);
        comment.dislikes--;
        comment.dislikeFlag = true;
      }
      else {
        // removes like
        // @ts-ignore
        if (localStorage.getItem(comment._id) === 'liked' || (comment.usersLiked.includes(this.currentUser._id) && !comment.dislikeFlag)) {
          localStorage.removeItem(comment._id);
          comment.likes--;
          comment.likeFlag = true;
        }
        localStorage.setItem(comment._id, 'disliked');
        comment.dislikes++;
      }
      comment.dislikeFlag = true;
    });
  }

  public getLocalStorageItem(id: string): string {
    return localStorage.getItem(id);
  }

  delete(comment: Comment): void {
    comment.text = '[deleted]';
    comment.username = '[deleted]';
    comment.date = null;
    this.userService.deleteComment(comment._id).subscribe(() => {
      this.loadBaseComments();
    });
  }

  addBaseComment(): void {
    this.submitted = true;
    if (!this.currentUser) {
      this.loggedIn = false;
      return;
    }
    this.userService.addComment(this.commentForm.controls.comment.value,
      this.currentUser._id).subscribe(() => {
        this.loadBaseComments();
    });
  }
}
