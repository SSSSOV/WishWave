import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Friend } from "src/friend/friend.model";

interface FriendStatusCreationAttrs {
    description: string;
}

@Table({tableName: 'friend_status'})
export class FriendStatus extends Model<FriendStatus, FriendStatusCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    description: string;
    
    @HasMany(() => Friend)
    friends: Friend[];
}