import { Model } from "sequelize-typescript";
interface BanCreationAttrs {
    description: string;
}
export declare class Ban extends Model<Ban, BanCreationAttrs> {
    id: number;
    description: string;
}
export {};
