import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/users.model";

interface BugReportAttr {
    title: string;
    description: string;
    email?: string | null;
    userId?: number | null;
}

@Table({tableName: 'bug_reports'})
export class BugReport extends Model<BugReport, BugReportAttr> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    declare id: number;

    @Column({type: DataType.STRING, allowNull: false})
    declare title: string;

    @Column({type: DataType.STRING, allowNull: false})
    declare description: string;

    @Column({type: DataType.STRING, allowNull: true})
    declare email: string;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: true})
    declare userId: number | null;

    @BelongsTo(() => User)
    user: User;
}
