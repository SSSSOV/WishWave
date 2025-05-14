import { Module } from '@nestjs/common';
import { BanService } from './ban.service';
import { BanController } from './ban.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ban } from './ban.model';
import { User } from 'src/users/users.model';

@Module({
  providers: [BanService],
  controllers: [BanController],
  imports: [
    SequelizeModule.forFeature([Ban, User])
  ]
})
export class BanModule {}
