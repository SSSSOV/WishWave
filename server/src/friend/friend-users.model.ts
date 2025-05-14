import {Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { Friend } from "./friend.model";

@Table({tableName: 'friend_users', createdAt: false, updatedAt: false})
export class FriendUsers extends Model<FriendUsers> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;

    @ForeignKey(()=>User)
    @Column({type: DataType.INTEGER})
    userid: number;

    @ForeignKey(()=>Friend)
    @Column({type: DataType.INTEGER})
    friendid: number;
}