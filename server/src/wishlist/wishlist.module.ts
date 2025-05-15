import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { WishList } from './wishlist.model';
import { Wish } from 'src/wish/wish.model';
import { WishListWish } from './wishlist-wish.model';
import { AccessLevel } from 'src/accesslevel/accesslevel.model';
import { User } from 'src/users/users.model';

@Module({
  providers: [WishlistService],
  controllers: [WishlistController],
  imports: [
    SequelizeModule.forFeature([WishList, Wish, WishListWish, AccessLevel, User]),
  ]
})
export class WishlistModule {}
