import { Model } from "sequelize-typescript";
interface AccessLevelCreationAttrs {
    name: string;
}
export declare class AccessLevel extends Model<AccessLevel, AccessLevelCreationAttrs> {
    id: number;
    name: string;
}
export {};
