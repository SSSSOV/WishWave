import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { Role } from 'src/roles/roles.model';
import { Friend } from 'src/friend/friend.model';
import { FriendUsers } from 'src/friend/friend-users.model';
import { Ban } from 'src/ban/ban.model';
import { WishList } from 'src/wishlist/wishlist.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Friend, FriendUsers, Ban, Role, WishList]),
  ]
})
export class UsersModule {}
