import { Model } from "sequelize-typescript";
interface FriendStatusCreationAttrs {
    description: string;
}
export declare class FriendStatus extends Model<FriendStatus, FriendStatusCreationAttrs> {
    id: number;
    description: string;
}
export {};
