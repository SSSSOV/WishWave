import {Column, DataType, Model, Table } from "sequelize-typescript";

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
}