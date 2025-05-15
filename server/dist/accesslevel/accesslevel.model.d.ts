import { Model } from "sequelize-typescript";
import { WishList } from "src/wishlist/wishlist.model";
interface AccessLevelCreationAttrs {
    name: string;
}
export declare class AccessLevel extends Model<AccessLevel, AccessLevelCreationAttrs> {
    id: number;
    name: string;
    wishlistId: number;
    wishlists: WishList;
}
export {};
