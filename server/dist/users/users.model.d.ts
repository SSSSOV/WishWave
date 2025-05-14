import { Model } from "sequelize-typescript";
interface UserCreationAttrs {
    login: string;
    password: string;
    email: string;
}
export declare class User extends Model<User, UserCreationAttrs> {
    id: number;
    full_name: string;
    login: string;
    password: string;
    email: string;
}
export {};
