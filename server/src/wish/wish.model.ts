import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";
import { WishListWish } from "src/wishlist/wishlist-wish.model";
import { WishList } from "src/wishlist/wishlist.model";
import { WishStatus } from "src/wishstatus/wishstatus.model";

interface WishCreationAttrs {
    name: string;
    price: number;
    image: string | null;
    productLink?: string;
    wishStatusId?: number;
    bookedByUserId?: number | null;
}

@Table({tableName: 'wish'})
export class Wish extends Model<Wish, WishCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;

    @Column({type: DataType.STRING, allowNull: false})
    declare name: string;

    @Column({type: DataType.STRING, allowNull: true})
    declare image: string;

    @Column({type: DataType.FLOAT, allowNull: false})
    declare price: number;

    @Column({type: DataType.STRING, allowNull: true})
    declare productLink: string;

    @ForeignKey(() => WishStatus)
    @Column({type: DataType.INTEGER})
    declare wishStatusId: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: true})
    declare bookedByUserId: number | null;
    
    @BelongsTo(() => User)
    declare bookedByUser: User;

    @BelongsToMany(() => WishList, () => WishListWish)
    declare wishlists: WishList[];

    @BelongsTo(() => WishStatus)
    declare wishstuses: WishStatus;
}