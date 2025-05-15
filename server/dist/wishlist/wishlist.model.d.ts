import { Model } from "sequelize-typescript";
import { Wish } from "src/wish/wish.model";
import { AccessLevel } from "src/accesslevel/accesslevel.model";
import { User } from "src/users/users.model";
interface WishListCreationAttrs {
    name: string;
}
export declare class WishList extends Model<WishList, WishListCreationAttrs> {
    id: number;
    name: string;
    wishs: Wish[];
    accesslevels: AccessLevel[];
    users: User[];
}
export {};
