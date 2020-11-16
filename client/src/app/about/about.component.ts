import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../_services/auth-service';
import {UserService} from '../_services/user-service';
import {Comment} from '../_models/comment';

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
  constructor(private authService: AuthService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.loadBaseComments();
    this.loggedIn = this.authService.getCurrentUserValue() != null;
  }

  loadBaseComments(): void {
    this.userService.getBaseComments().subscribe(res => {
      this.baseComments = res;

      this.loadUserComments().then(() => {
        this.baseComments.forEach(comment => {
          console.log(this.userComments);
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
      this.userService.getUserComments(this.authService.getCurrentUserValue()._id).subscribe(res => {
        this.userComments = res;
        resolve();
      });
    });
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
    if (!this.authService.getCurrentUserValue()) {
      console.log(this.authService.getCurrentUserValue());
      this.loggedIn = false;
      return;
    }
    this.userService.addComment(this.commentForm.controls.comment.value,
      this.authService.getCurrentUserValue()._id).subscribe(() => {
        this.loadBaseComments();
    });
  }
}
