import { Model } from "sequelize-typescript";
interface WishListWishCreationAttrs {
    wishlistId: number;
    wishId: number;
}
export declare class WishListWish extends Model<WishListWish, WishListWishCreationAttrs> {
    id: number;
    wishlistId: number;
    wishId: number;
}
export {};
