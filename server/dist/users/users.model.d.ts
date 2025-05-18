import { Model } from "sequelize-typescript";
import { Ban } from "src/ban/ban.model";
import { Friend } from "src/friend/friend.model";
import { Role } from "src/roles/roles.model";
import { WishList } from "src/wishlist/wishlist.model";
import { WishStatus } from "src/wishstatus/wishstatus.model";
interface UserCreationAttrs {
    login: string;
    password: string;
    email: string;
    roleId: number;
}
export declare class User extends Model<User, UserCreationAttrs> {
    id: number;
    full_name: string;
    login: string;
    password: string;
    email: string;
    roleId: number;
    banId: number;
    friend: Friend[];
    ban: Ban;
    role: Role;
    wishlist: WishList[];
    wishstatuses: WishStatus[];
}
export {};
