import { Model } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { Wish } from "src/wish/wish.model";
interface WishStatusCreationAttrs {
    userid: number;
    name: string;
}
export declare class WishStatus extends Model<WishStatus, WishStatusCreationAttrs> {
    id: number;
    name: string;
    bookedByUserId: number;
    bookedByUser: User;
    wishes: Wish[];
}
export {};
