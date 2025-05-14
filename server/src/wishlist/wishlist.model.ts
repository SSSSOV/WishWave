import {Column, DataType, Model, Table } from "sequelize-typescript";

interface WishListCreationAttrs {
    name: string;
}

@Table({tableName: 'wish_list'})
export class WishList extends Model<WishList, WishListCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;

    @Column({type: DataType.STRING, allowNull: false})
    name: string;
}