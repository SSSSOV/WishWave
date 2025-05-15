import { Model } from "sequelize-typescript";
import { WishList } from "src/wishlist/wishlist.model";
import { WishStatus } from "src/wishstatus/wishstatus.model";
interface WishCreationAttrs {
    name: string;
    price: number;
}
export declare class Wish extends Model<Wish, WishCreationAttrs> {
    id: number;
    name: string;
    image: string;
    price: number;
    product_link: string;
    wishstatusId: Number;
    wishlists: WishList[];
    wishstuses: WishStatus;
}
export {};
