import { Model } from "sequelize-typescript";
interface UserCreationAttrs {
    login: string;
    password: string;
    email: string;
}
export declare class User extends Model<User, UserCreationAttrs> {
    iden: number;
    full_name: string;
    login: string;
    password: string;
    email: string;
    banned: boolean;
    ban_reason: string;
}
export {};
