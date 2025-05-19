import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AccessLevel } from 'src/accesslevel/accesslevel.model';
import { Role } from 'src/roles/roles.model';
import { WishStatus } from 'src/wishstatus/wishstatus.model';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel(AccessLevel) private accessLevelModel: typeof AccessLevel,
    @InjectModel(Role) private roleModel: typeof Role,
    @InjectModel(WishStatus) private wishStatusModel: typeof WishStatus,
  ) {}

  async onModuleInit() {
    await this.seedAccessLevels();
    await this.seedRoles();
    await this.seedWishStatuses();
  }

  async seedAccessLevels() {
    const defaultLevels = ['public', 'private', 'linkOnly', 'friends'];
    for (const name of defaultLevels) {
      const [level, created] = await this.accessLevelModel.findOrCreate({ where: { name } });
    }
  }

    async seedRoles() {
        const roles = [
            {value: 'user', description: 'Пользователь'},
            {value: 'admin', description: 'Администратор'},
        ];

        for (const role of roles) {
            await this.roleModel.findOrCreate({where: {value: role.value}, defaults: {value: role.value, description: role.description}})
        }
    }

  async seedWishStatuses() {
    const statuses = ['active', 'reserved', 'completed'];
    for (const name of statuses) {
      await this.wishStatusModel.findOrCreate({ where: { name } });
    }
  }
}
