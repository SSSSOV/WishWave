import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { WishList } from './wishlist.model';
import { Wish } from 'src/wish/wish.model';
import { WishListWish } from './wishlist-wish.model';
import { AccessLevel } from 'src/accesslevel/accesslevel.model';
import { User } from 'src/users/users.model';
import { AuthModule } from 'src/auth/auth.module';
import { Friend } from 'src/friend/friend.model';
import { FriendStatus } from 'src/friendstatus/friendstatus.model';
import { ProfanityModule } from 'src/profanity/profanity.module';

@Module({
  providers: [WishlistService],
  controllers: [WishlistController],
  imports: [
    SequelizeModule.forFeature([WishList, Wish, WishListWish, AccessLevel, User, Friend, FriendStatus]),
    AuthModule,
    ProfanityModule
  ],
  exports: [WishlistService]
})
export class WishlistModule {}
