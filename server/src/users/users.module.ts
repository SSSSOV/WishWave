import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { Role } from 'src/roles/roles.model';
import { Friend } from 'src/friend/friend.model';
import { FriendUsers } from 'src/friend/friend-users.model';
import { Ban } from 'src/ban/ban.model';
import { WishList } from 'src/wishlist/wishlist.model';
import { RolesModule } from 'src/roles/roles.module';
import { Wish } from 'src/wish/wish.model';
import { AuthModule } from 'src/auth/auth.module';
import { FileModule } from 'src/file/file.module';
import { FriendModule } from 'src/friend/friend.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Friend, FriendUsers, Ban, Role, WishList, Wish]),
    RolesModule,
    FileModule,
    forwardRef(() => AuthModule),
    forwardRef(() => FriendModule),
  ],
  exports: [
    UsersService
  ]
})
export class UsersModule {}
