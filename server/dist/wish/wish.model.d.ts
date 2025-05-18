import { Model } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { WishList } from "src/wishlist/wishlist.model";
import { WishStatus } from "src/wishstatus/wishstatus.model";
interface WishCreationAttrs {
    name: string;
    price: number;
    image: string;
}
export declare class Wish extends Model<Wish, WishCreationAttrs> {
    id: number;
    name: string;
    image: string;
    price: number;
    product_link: string;
    wishStatusId: number;
    bookedByUserId: number | null;
    bookedByUser: User;
    wishlists: WishList[];
    wishstuses: WishStatus;
}
export {};
