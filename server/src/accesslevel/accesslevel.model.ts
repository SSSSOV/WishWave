import {Column, DataType, Model, Table } from "sequelize-typescript";

interface AccessLevelCreationAttrs {
    name: string;
}

@Table({tableName: 'access_level'})
export class AccessLevel extends Model<AccessLevel, AccessLevelCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;
}