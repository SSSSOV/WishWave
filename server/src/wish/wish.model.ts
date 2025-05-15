import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { WishListWish } from "src/wishlist/wishlist-wish.model";
import { WishList } from "src/wishlist/wishlist.model";
import { WishStatus } from "src/wishstatus/wishstatus.model";

interface WishCreationAttrs {
    name: string;
    price: number;
}

@Table({tableName: 'wish'})
export class Wish extends Model<Wish, WishCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @Column({type: DataType.STRING, allowNull: true})
    image: string;

    @Column({type: DataType.FLOAT, allowNull: false})
    price: number;

    @Column({type: DataType.STRING, allowNull: true})
    product_link: string;

    @ForeignKey(() => WishStatus)
    @Column({type: DataType.INTEGER})
    wishstatusId: Number;

    @BelongsToMany(() => WishList, () => WishListWish)
    wishlists: WishList[];

    @BelongsTo(() => WishStatus)
    wishstuses: WishStatus;
}