import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';
import { ConfigModule } from "@nestjs/config";
import { User } from "./users/users.model";
import { RolesModule } from './roles/roles.module';
import { Role } from "./roles/roles.model";
import { BanModule } from './ban/ban.module';
import { FriendModule } from './friend/friend.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { FriendstatusModule } from './friendstatus/friendstatus.module';
import { AccesslevelModule } from './accesslevel/accesslevel.module';
import { WishModule } from './wish/wish.module';
import { WishstatusModule } from './wishstatus/wishstatus.module';


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
          models: [User, Role],
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
      ]
})
export class AppModule {}