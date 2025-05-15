import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Wish } from "src/wish/wish.model";

interface WishStatusCreationAttrs {
    userid: number;
    name: string;
}

@Table({tableName: 'wish_status'})
export class WishStatus extends Model<WishStatus, WishStatusCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;

    @Column({type: DataType.INTEGER, unique: true, allowNull: false})
    userid: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;

    @HasMany(() => Wish)
    wishs: Wish[];
}