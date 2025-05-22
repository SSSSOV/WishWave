import {Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { WishList } from "./wishlist.model";
import { Wish } from "src/wish/wish.model";

interface WishListWishCreationAttrs {
    wishlistId: number;
    wishId: number;
}

@Table({tableName: 'wishlist_wish', createdAt: false, updatedAt: false})
export class WishListWish extends Model<WishListWish, WishListWishCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;

    @ForeignKey(()=>WishList)
    @Column({type: DataType.INTEGER, field: "wishlist_id"})
    declare wishlistId: number;

    @ForeignKey(()=>Wish)
    @Column({type: DataType.INTEGER, field: "wish_id"})
    declare wishId: number;
}