import {Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";

interface BanCreationAttrs {
    description: string;
}

@Table({tableName: 'bans'})
export class Ban extends Model<Ban, BanCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;

    @Column({type: DataType.STRING, allowNull: true})
    description: string;

    @HasMany(() => User)
    users: User[];
}