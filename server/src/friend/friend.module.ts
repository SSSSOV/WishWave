import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Friend } from './friend.model';
import { User } from 'src/users/users.model';
import { FriendUsers } from './friend-users.model';
import { FriendStatus } from 'src/friendstatus/friendstatus.model';

@Module({
  providers: [FriendService],
  controllers: [FriendController],
  imports: [
    SequelizeModule.forFeature([Friend, User, FriendUsers, FriendStatus]),
  ]
})
export class FriendModule {}
