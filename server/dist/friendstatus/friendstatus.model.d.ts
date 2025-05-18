import { Model } from "sequelize-typescript";
import { Friend } from "src/friend/friend.model";
interface FriendStatusCreationAttrs {
    description: string;
}
export declare class FriendStatus extends Model<FriendStatus, FriendStatusCreationAttrs> {
    id: number;
    description: string;
    friends: Friend[];
}
export {};
