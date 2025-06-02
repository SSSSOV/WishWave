import {BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { FriendStatus } from "src/friendstatus/friendstatus.model";

interface FriendCreationAttrs {
    sender: number;
    recipient: number;
    friendstatusId: number;
}

@Table({tableName: 'friend'})
export class Friend extends Model<Friend, FriendCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;

    @ForeignKey(() => FriendStatus)
    @Column({type: DataType.INTEGER})
    declare friendstatusId: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare sender: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare recipient: number;

    @BelongsTo(() => User, 'sender')
    senderUser: User;

    @BelongsTo(() => User, 'recipient')
    recipientUser: User;

    @BelongsTo(() => FriendStatus)
    friendstatus: FriendStatus;
}