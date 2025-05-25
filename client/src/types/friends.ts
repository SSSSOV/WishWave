import { IUser } from "./user";

export interface IFriend {
  id: number;
  login: string;
  email: string;
  fullname?: string;
  image?: string;
}

export interface IFriendRequest {
  id: number;
  userid1: number;
  userid2: number;
  friendstatusId: number;
  users: IUser[];
}
