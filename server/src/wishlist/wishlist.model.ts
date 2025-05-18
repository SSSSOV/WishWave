import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Wish } from "src/wish/wish.model";
import { WishListWish } from "./wishlist-wish.model";
import { AccessLevel } from "src/accesslevel/accesslevel.model";
import { User } from "src/users/users.model";

interface WishListCreationAttrs {
    name: string;
    userId:number;
}

@Table({tableName: 'wish_list'})
export class WishList extends Model<WishList, WishListCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    userId: number;

    @ForeignKey(() => AccessLevel)
    @Column({type: DataType.INTEGER, allowNull: false})
    accesslevelId: number;

    @BelongsToMany(() => Wish, () => WishListWish)
    wishes: Wish[];

    @BelongsTo(() => AccessLevel)
    accesslevels: AccessLevel;

    @BelongsTo(() => User)
    user: User;
}