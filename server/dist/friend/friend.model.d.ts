import { Model } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { FriendStatus } from "src/friendstatus/friendstatus.model";
interface FriendCreationAttrs {
    userid1: number;
    userid2: number;
}
export declare class Friend extends Model<Friend, FriendCreationAttrs> {
    id: number;
    userid1: number;
    userid2: number;
    users: User[];
    friendstatuses: FriendStatus[];
}
export {};
