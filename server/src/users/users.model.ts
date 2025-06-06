import { AllowNull, BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Ban } from "src/ban/ban.model";
import { BugReport } from "src/bugreport/bugreport.model";
import { Friend } from "src/friend/friend.model";
import { Role } from "src/roles/roles.model";
import { Wish } from "src/wish/wish.model";
import { WishList } from "src/wishlist/wishlist.model";

interface UserCreationAttrs {
  login: string;
  password: string;
  email: string;
  roleId: number;
  banId?: number;
  fullName?: string;
}

@Table({ tableName: "users" })
export class User extends Model<User, UserCreationAttrs> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  declare id: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare fullname: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  declare login: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare image: string | null;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  declare birthDate: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  declare phone: string | null;

  @Column({ type: DataType.ENUM("male", "female"), allowNull: true })
  declare gender: "male" | "female" | null;

  @Column({ type: DataType.JSONB, allowNull: true })
  declare socials: { [key: string]: string } | null;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare roleId: number;

  @ForeignKey(() => Ban)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare banId: number | null;

  @HasMany(() => Friend, 'sender')
  sendRequest: Friend[];

  @HasMany(() => Friend, 'recipient')
  receivedRequests: Friend[];

  @BelongsTo(() => Ban)
  declare ban: Ban;

  @BelongsTo(() => Role)
  declare role: Role;

  @HasMany(() => WishList)
  declare wishlist: WishList[];

  @HasMany(() => Wish)
  wishstatuses: Wish[];

  @HasMany(() => BugReport)
  bagReports: BugReport[];
}
