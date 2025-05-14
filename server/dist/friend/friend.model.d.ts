import { Model } from "sequelize-typescript";
interface FriendCreationAttrs {
    userid1: number;
    userid2: number;
}
export declare class Friend extends Model<Friend, FriendCreationAttrs> {
    id: number;
    userid1: number;
    userid2: number;
}
export {};
