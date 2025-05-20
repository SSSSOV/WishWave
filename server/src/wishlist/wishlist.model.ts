import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Wish } from "src/wish/wish.model";
import { WishListWish } from "./wishlist-wish.model";
import { AccessLevel } from "src/accesslevel/accesslevel.model";
import { User } from "src/users/users.model";

interface WishListCreationAttrs {

}

@Table({tableName: 'wish_list'})
export class WishList extends Model<WishList, WishListCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;

    @Column({type: DataType.STRING, allowNull: false})
    declare name: string;

    @Column({type: DataType.STRING, unique: true, allowNull: true, field: 'share_token'})
    declare shareToken: string | null;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    declare userId: number;

    @ForeignKey(() => AccessLevel)
    @Column({type: DataType.INTEGER, allowNull: false})
    declare accesslevelId: number;

    @BelongsToMany(() => Wish, () => WishListWish)
    wishes: Wish[];

    @BelongsTo(() => AccessLevel, {foreignKey: 'accesslevelId', as: 'accesslevel' }) 
    accesslevel: AccessLevel;

    @BelongsTo(() => User,  {foreignKey: 'userId'})
    user: User;
}