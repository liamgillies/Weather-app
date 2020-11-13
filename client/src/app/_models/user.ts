export class User {
  // tslint:disable-next-line:variable-name
  _id: string;
  username: string;
  password: string;
  token?: string;
  savedLocations: string[];
}
