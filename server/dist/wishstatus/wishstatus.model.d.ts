import { Model } from "sequelize-typescript";
import { Wish } from "src/wish/wish.model";
interface WishStatusCreationAttrs {
    name: string;
}
export declare class WishStatus extends Model<WishStatus, WishStatusCreationAttrs> {
    id: number;
    name: string;
    wishes: Wish[];
}
export {};
