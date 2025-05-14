import { Model } from "sequelize-typescript";
import { User } from "src/users/users.model";
interface BanCreationAttrs {
    description: string;
}
export declare class Ban extends Model<Ban, BanCreationAttrs> {
    id: number;
    description: string;
    userId: number;
    users: User;
}
export {};
