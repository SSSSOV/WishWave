import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { AccessLevel } from "src/accesslevel/accesslevel.model";
import { Role } from "src/roles/roles.model";
import { User } from "src/users/users.model";
import { WishStatus } from "src/wishstatus/wishstatus.model";
import * as bcrypt from "bcryptjs";
import { FriendStatus } from "src/friendstatus/friendstatus.model";

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(AccessLevel) private accessLevelModel: typeof AccessLevel,
    @InjectModel(Role) private roleModel: typeof Role,
    @InjectModel(WishStatus) private wishStatusModel: typeof WishStatus,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(FriendStatus) private friendStatusModel: typeof FriendStatus
  ) {}

  async onModuleInit() {
    await this.seedAccessLevels();
    await this.seedRoles();
    await this.seedWishStatuses();
    await this.seedFriendStatuses();
    await this.seedAdminUser();
  }

  async seedAccessLevels() {
    const defaultLevels = ["public", "private", "linkOnly", "friends"];
    for (const name of defaultLevels) {
      const [level, created] = await this.accessLevelModel.findOrCreate({ where: { name } });
    }
  }

  async seedRoles() {
    const roles = [
      { value: "user", description: "Пользователь" },
      { value: "admin", description: "Администратор" },
    ];

    for (const role of roles) {
      await this.roleModel.findOrCreate({ where: { value: role.value }, defaults: { value: role.value, description: role.description } });
    }
  }

  async seedWishStatuses() {
    const statuses = ["active", "reserved", "completed"];
    for (const name of statuses) {
      await this.wishStatusModel.findOrCreate({ where: { name } });
    }
  }

  async seedFriendStatuses() {
    const statuses = ["pending", "accepted", "rejected"];
    for (const name of statuses) {
      await this.friendStatusModel.findOrCreate({ where: { name } });
    }
  }

  async seedAdminUser() {
    const adminRole = await this.roleModel.findOne({ where: { value: "admin" } });
    if (!adminRole) {
      return;
    }

    const login = "root";
    const email = "root@mail.ru";
    const existing = await this.userModel.findOne({ where: { login } });
    if (existing) {
      return;
    }

    const passwordHash = await bcrypt.hash("root", 10);
    await this.userModel.create({
      login,
      email,
      password: passwordHash,
      roleId: adminRole.id,
      fullName: "Администратор",
    });

    console.log("root created!");
  }
}
