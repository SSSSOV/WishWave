import { Module } from '@nestjs/common';
import { FriendstatusService } from './friendstatus.service';
import { FriendstatusController } from './friendstatus.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { FriendStatus } from './friendstatus.model';
import { Friend } from 'src/friend/friend.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [FriendstatusService],
  controllers: [FriendstatusController],
  imports: [
    SequelizeModule.forFeature([FriendStatus, Friend]),
    AuthModule
  ]
})
export class FriendstatusModule {}
