import {Column, DataType, Model, Table } from "sequelize-typescript";

interface FriendStatusCreationAttrs {
    description: string;
}

@Table({tableName: 'friend_status'})
export class FriendStatus extends Model<FriendStatus, FriendStatusCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    description: string;
}