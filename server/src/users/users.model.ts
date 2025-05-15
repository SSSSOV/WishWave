import {AllowNull, BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Ban } from "src/ban/ban.model";
import { FriendUsers } from "src/friend/friend-users.model";
import { Friend } from "src/friend/friend.model";
import { Role } from "src/roles/roles.model";
import { WishList } from "src/wishlist/wishlist.model";

interface UserCreationAttrs {
    login: string;
    password: string;
    email: string;
    roleId: number;
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;

    @Column({type: DataType.STRING, allowNull: true})
    full_name: string;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    login: string;

    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @ForeignKey(() => Role)
    @Column({type: DataType.INTEGER, allowNull: false})
    roleId: number;

    @ForeignKey(() => Ban)
    @Column({type: DataType.INTEGER, allowNull: true})
    banId: number;

    @BelongsToMany(() => Friend, () => FriendUsers)
    friend: Friend[];

    @BelongsTo(() => Ban)
    ban: Ban;

    @BelongsTo(() => Role)
    rolе: Role;

    @HasMany(() => WishList)
    wishlist: WishList[];
}