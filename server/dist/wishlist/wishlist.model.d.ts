import { Model } from "sequelize-typescript";
import { Wish } from "src/wish/wish.model";
import { AccessLevel } from "src/accesslevel/accesslevel.model";
import { User } from "src/users/users.model";
interface WishListCreationAttrs {
    name: string;
    userId: number;
}
export declare class WishList extends Model<WishList, WishListCreationAttrs> {
    id: number;
    name: string;
    userId: number;
    accesslevelId: number;
    wishes: Wish[];
    accesslevels: AccessLevel;
    user: User;
}
export {};
