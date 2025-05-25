import { Module } from '@nestjs/common';
import { WishService } from './wish.service';
import { WishController } from './wish.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Wish } from './wish.model';
import { WishList } from 'src/wishlist/wishlist.model';
import { WishListWish } from 'src/wishlist/wishlist-wish.model';
import { WishStatus } from 'src/wishstatus/wishstatus.model';
import { FileModule } from 'src/file/file.module';
import { AuthModule } from 'src/auth/auth.module';
import { WishlistModule } from 'src/wishlist/wishlist.module';
import { ProfanityModule } from 'src/profanity/profanity.module';

@Module({
  providers: [WishService],
  controllers: [WishController],
  imports: [
    SequelizeModule.forFeature([Wish, WishList, WishListWish, WishStatus]),
    FileModule,
    AuthModule,
    WishlistModule,
    ProfanityModule
  ]
})
export class WishModule {}
