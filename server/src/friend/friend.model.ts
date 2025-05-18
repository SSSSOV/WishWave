import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { FriendUsers } from "./friend-users.model";
import { FriendStatus } from "src/friendstatus/friendstatus.model";

interface FriendCreationAttrs {
    userid1: number;
    userid2: number;
}

@Table({tableName: 'friend'})
export class Friend extends Model<Friend, FriendCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;

    @Column({type: DataType.INTEGER, allowNull: false})
    userid1: number;

    @Column({type: DataType.INTEGER, allowNull: false})
    userid2: number;

    @ForeignKey(() => FriendStatus)
    @Column({type: DataType.INTEGER})
    friendstatusId: number;

    @BelongsToMany(() => User, () => FriendUsers)
    users: User[];

    @BelongsTo(() => FriendStatus)
    friendstatus: FriendStatus;
}