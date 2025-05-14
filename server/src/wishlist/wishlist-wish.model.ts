import {Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { WishList } from "./wishlist.model";
import { Wish } from "src/wish/wish.model";

@Table({tableName: 'wishlist_wish', createdAt: false, updatedAt: false})
export class WishListWish extends Model<WishListWish> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;

    @ForeignKey(()=>WishList)
    @Column({type: DataType.INTEGER})
    wishlistid: number;

    @ForeignKey(()=>Wish)
    @Column({type: DataType.INTEGER})
    wishid: number;
}