import { Model } from "sequelize-typescript";
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
}
export {};
