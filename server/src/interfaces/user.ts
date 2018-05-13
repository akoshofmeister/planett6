export interface IUser {
  username: string;
}

export interface IUserWithToken {
  user: IUser;
  authToken: string;
}
