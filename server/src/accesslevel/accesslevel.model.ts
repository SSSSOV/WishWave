import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { WishList } from "src/wishlist/wishlist.model";

interface AccessLevelCreationAttrs {
    name: string;
}

@Table({tableName: 'access_level'})
export class AccessLevel extends Model<AccessLevel, AccessLevelCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;

    @HasMany(() => WishList)
    wishlists: WishList[];
}