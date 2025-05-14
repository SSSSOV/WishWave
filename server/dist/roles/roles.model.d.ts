import { Model } from "sequelize-typescript";
interface RoleCreationAttrs {
    value: string;
}
export declare class Role extends Model<Role, RoleCreationAttrs> {
    id: number;
    value: string;
    description: string;
}
export {};
