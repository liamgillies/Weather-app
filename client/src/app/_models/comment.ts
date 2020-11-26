export class Comment {
  // tslint:disable-next-line:variable-name
  _id: string;
  text: string;
  username: string;
  date: Date;
  likes: number;
  dislikes: number;
  replyIDs: string[];
  replies: Comment[];
  base: boolean;
  own: boolean;
  usersLiked: string[];
  usersDisliked: string[];
  likeFlag: boolean;
  dislikeFlag: boolean;
  showReplyForm: boolean;
  showReplies: boolean;
}
