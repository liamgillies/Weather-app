import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../_services/auth-service';
import {UserService} from '../_services/user-service';
import {Comment} from '../_models/comment';
import {User} from '../_models/user';

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
  public allComments = [];
  public username = 'asdfasd';
  constructor(private authService: AuthService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.loadBaseComments();
    this.loggedIn = this.authService.getCurrentUserValue() != null;
    this.currentUser = this.authService.getCurrentUserValue();
    if (!this.currentUser) {
      // create pseudo user to avoid errors when not logged in
      this.currentUser = {password: '', savedLocations: [], username: '', _id: 'invalid user id'};
    }
  }

  loadBaseComments(): void {
    this.userService.getBaseComments().subscribe(res => {
      // @ts-ignore, sort by likes
      res.sort((a: Comment, b: Comment) => {
        return (b.likes - b.dislikes) - (a.likes - a.dislikes);
      });
      this.baseComments = res;
      // register the user's own comments for deletion
      this.getUserComments().then(() => {
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

  // gets all of the user's comments
   getUserComments(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.userService.getUserComments(this.currentUser._id).subscribe(res => {
        this.userComments = res;
        resolve();
      });
    });
  }

  // gets all comments, currently unused
  getAllComments(): Promise<void> {
    return new Promise<void>(resolve => {
      this.userService.getAllComments().subscribe(res => {
        this.allComments = res;
        resolve();
      });
    });
  }

  // like a comment
  like(comment: Comment): void {
    this.userService.like(comment._id, this.currentUser._id).subscribe(() => {
      // if already liked
      if (localStorage.getItem(comment._id) === 'liked' ||
        (comment.usersLiked.includes(this.currentUser._id) && !comment.likeFlag)) {
        localStorage.removeItem(comment._id);
        comment.likes--;
        comment.likeFlag = true;
        comment.dislikeFlag = true;
      }
      else {
        // removes dislike
        if (localStorage.getItem(comment._id) === 'disliked' ||
          (comment.usersDisliked.includes(this.currentUser._id) && !comment.likeFlag)) {
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

  // dislike a comment
  dislike(comment: Comment): void {
    this.userService.dislike(comment._id, this.currentUser._id).subscribe(() => {
      // if already dislikes
      if (localStorage.getItem(comment._id) === 'disliked' ||
        (comment.usersDisliked.includes(this.currentUser._id)
        && !comment.dislikeFlag)) {
        localStorage.removeItem(comment._id);
        comment.dislikes--;
        comment.dislikeFlag = true;
        comment.likeFlag = true;
      }
      else {
        // removes like
        if (localStorage.getItem(comment._id) === 'liked' ||
          (comment.usersLiked.includes(this.currentUser._id) && !comment.dislikeFlag)) {
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

  // getter for HTML
  public getLocalStorageItem(id: string): string {
    return localStorage.getItem(id);
  }

  // open reply form
  replyClicked(comment: Comment): void {
    // close all other reply forms
    this.baseComments.forEach(baseComment => {
      baseComment.replies.forEach(reply => reply.showReplyForm = false);
      baseComment.showReplyForm = false;
    });
    // set text to username of person clicked
    this.username = comment.username + ' ';
    comment.showReplyForm = true;
  }

  // add a reply to a comment
  addReply(comment: Comment): void {
    this.submitted = true;
    if (!this.currentUser) {
      this.loggedIn = false;
      return;
    }
    else if (!this.commentForm.invalid) {
      let tempBaseComment = comment;
      // if replying to a reply, reply to base comment instead
      this.baseComments.forEach(baseComment => {
        if (baseComment.replyIDs.includes(comment._id)) {
          tempBaseComment = baseComment;
        }
      });
      this.userService.addReply(tempBaseComment._id, this.currentUser._id, this.commentForm.controls.comment.value).subscribe(c => {
        // close all reply forms
        this.baseComments.forEach(baseComment => {
          baseComment.replies.forEach(reply => reply.showReplyForm = false);
          baseComment.showReplyForm = false;
        });
        if (tempBaseComment.base) {
          this.loadReplies(comment);
        }
        // @ts-ignore, display comment on frontend
        tempBaseComment.replies.push(c);
      });
    }
  }

  // closes reply form
  closeForm(): void {
    this.baseComments.forEach(baseComment => {
      baseComment.replies.forEach(reply => reply.showReplyForm = false);
      baseComment.showReplyForm = false;
    });
  }

  // load the replies of a comment
  loadReplies(comment: Comment): void {
    comment.showReplies = true;
    this.getUserComments().then(() => {
      comment.replies.forEach((reply: Comment) => {
        this.userComments.forEach(id => {
          if (id === reply._id) {
            reply.own = true;
          }
        });
      });
    });
  }

  // hide the replies
  hideReplies(comment: Comment): void {
    comment.showReplies = false;
  }

  // delete a base comment
  deleteComment(comment: Comment): void {
    comment.text = '[deleted]';
    comment.username = '[deleted]';
    comment.date = null;
    this.userService.deleteComment(comment._id).subscribe(() => {
      this.loadBaseComments();
    });
  }

  // delete a reply to a comment
  deleteReply(reply: Comment): void {
    reply.text = '[deleted]';
    reply.username = '[deleted]';
    reply.date = null;
    this.userService.deleteReply(reply._id).subscribe(() => {
      this.loadBaseComments();
    });
  }

  addBaseComment(): void {
    this.submitted = true;
    if (!this.currentUser) {
      this.loggedIn = false;
      return;
    }
    else if (!this.commentForm.invalid) {
      this.userService.addComment(this.commentForm.controls.comment.value,
        this.currentUser._id).subscribe(() => {
        this.loadBaseComments();
      });
    }
  }
}
