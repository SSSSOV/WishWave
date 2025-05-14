import { Model } from "sequelize-typescript";
interface WishStatusCreationAttrs {
    userid: number;
    name: string;
}
export declare class WishStatus extends Model<WishStatus, WishStatusCreationAttrs> {
    id: number;
    userid: number;
    name: string;
}
export {};
