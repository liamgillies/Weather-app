export class Comment {
  // tslint:disable-next-line:variable-name
  _id: string;
  text: string;
  username: string;
  date: Date;
  likes: number;
  dislikes: number;
  replies: [];
  base: boolean;
  own: boolean;
}
