import { Model } from "sequelize-typescript";
import { Wish } from "src/wish/wish.model";
interface WishStatusCreationAttrs {
    userid: number;
    name: string;
}
export declare class WishStatus extends Model<WishStatus, WishStatusCreationAttrs> {
    id: number;
    userid: number;
    name: string;
    wishs: Wish[];
}
export {};
