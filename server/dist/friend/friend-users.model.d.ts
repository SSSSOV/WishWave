import { Model } from "sequelize-typescript";
export declare class FriendUsers extends Model<FriendUsers> {
    id: number;
    userid: number;
    friendid: number;
}
