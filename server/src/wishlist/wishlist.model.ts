import {BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Wish } from "src/wish/wish.model";
import { WishListWish } from "./wishlist-wish.model";
import { AccessLevel } from "src/accesslevel/accesslevel.model";
import { User } from "src/users/users.model";

interface WishListCreationAttrs {
    name: string;
}

@Table({tableName: 'wish_list'})
export class WishList extends Model<WishList, WishListCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @BelongsToMany(() => Wish, () => WishListWish)
    wishs: Wish[];

    @HasMany(() => AccessLevel)
    accesslevels: AccessLevel[];

    @HasMany(() => User)
    users: User[];
}