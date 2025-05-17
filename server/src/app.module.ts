import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { BanModule } from './ban/ban.module';
import { FriendModule } from './friend/friend.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { FriendstatusModule } from './friendstatus/friendstatus.module';
import { AccesslevelModule } from './accesslevel/accesslevel.module';
import { WishModule } from './wish/wish.module';
import { WishstatusModule } from './wishstatus/wishstatus.module';
import { WishStatus } from "./wishstatus/wishstatus.model";
import { Wish } from "./wish/wish.model";
import { WishListWish } from "./wishlist/wishlist-wish.model";
import { WishList } from "./wishlist/wishlist.model";
import { AccessLevel } from "./accesslevel/accesslevel.model";
import { User } from "./users/users.model";
import { FriendUsers } from "./friend/friend-users.model";
import { Friend } from "./friend/friend.model";
import { Ban } from "./ban/ban.model";
import { Role } from "./roles/roles.model";
import { FriendStatus } from "./friendstatus/friendstatus.model";
import { AuthModule } from './auth/auth.module';



@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        SequelizeModule.forRoot({
          dialect: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: Number(process.env.POSTGRES_PORT),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database:  process.env.POSTGRES_DB,
          models: [WishStatus, Wish, WishListWish, WishList, AccessLevel, User, FriendUsers, Friend, Ban, Role, FriendStatus],
          autoLoadModels: true
        }),
        UsersModule,
        RolesModule,
        BanModule,
        FriendModule,
        WishlistModule,
        FriendstatusModule,
        AccesslevelModule,
        WishModule,
        WishstatusModule,
        AuthModule,
      ]
})
export class AppModule {}