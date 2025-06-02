import {Column, DataType, Model, Table} from "sequelize-typescript";

interface PendingUserAttrs {
  login: string;
  email: string;
  passwordHash: string;
  code: string;
  expiresAt: Date;
}

@Table({ tableName: "pending_users", timestamps: false })
export class PendingUser extends Model<PendingUser, PendingUserAttrs> {
    @Column({type: DataType.INTEGER, autoIncrement: true, primaryKey: true, unique: true})
    declare id: number;

    @Column({type: DataType.STRING, allowNull: false, unique: true })
    declare login: string;

    @Column({type: DataType.STRING, allowNull: false, unique: true })
    declare email: string;

    @Column({type: DataType.STRING, allowNull: false })
    declare passwordHash: string;

    @Column({type: DataType.STRING, allowNull: false })
    declare code: string;

    @Column({type: DataType.DATE, allowNull: false })
    declare expiresAt: Date;
}
