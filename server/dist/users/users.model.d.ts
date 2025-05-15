import { Model } from "sequelize-typescript";
import { Ban } from "src/ban/ban.model";
import { Friend } from "src/friend/friend.model";
import { Role } from "src/roles/roles.model";
import { WishList } from "src/wishlist/wishlist.model";
interface UserCreationAttrs {
    login: string;
    password: string;
    email: string;
}
export declare class User extends Model<User, UserCreationAttrs> {
    id: number;
    full_name: string;
    login: string;
    password: string;
    email: string;
    roleId: number;
    banId: number;
    friends: Friend[];
    bans: Ban;
    rolеs: Role;
    wishlists: WishList[];
}
export {};
