import { Module } from '@nestjs/common';
import { BanService } from './ban.service';
import { BanController } from './ban.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ban } from './ban.model';
import { User } from 'src/users/users.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [BanService],
  controllers: [BanController],
  imports: [
    SequelizeModule.forFeature([Ban, User]),
    AuthModule
  ]
})
export class BanModule {}
