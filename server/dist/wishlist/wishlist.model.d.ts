import { Model } from "sequelize-typescript";
interface WishListCreationAttrs {
    name: string;
}
export declare class WishList extends Model<WishList, WishListCreationAttrs> {
    id: number;
    name: string;
}
export {};
