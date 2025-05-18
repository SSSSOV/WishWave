import { Model } from "sequelize-typescript";
import { User } from "src/users/users.model";
interface RoleCreationAttrs {
    value: string;
}
export declare class Role extends Model<Role, RoleCreationAttrs> {
    id: number;
    value: string;
    description: string;
    users: User[];
}
export {};
