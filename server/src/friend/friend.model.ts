import {Column, DataType, Model, Table } from "sequelize-typescript";

interface FriendCreationAttrs {
    userid1: number;
    userid2: number;
}

@Table({tableName: 'roles'})
export class Friend extends Model<Friend, FriendCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;

    @Column({type: DataType.INTEGER, unique: true, allowNull: false})
    userid1: number;

    @Column({type: DataType.INTEGER, unique: true, allowNull: false})
    userid2: number;
}