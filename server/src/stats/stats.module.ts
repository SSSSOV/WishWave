import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { BugReport } from 'src/bugreport/bugreport.model';
import { Wish } from 'src/wish/wish.model';
import { WishList } from 'src/wishlist/wishlist.model';
import { User } from 'src/users/users.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [StatsService],
  controllers: [StatsController],
  imports: [
    SequelizeModule.forFeature([BugReport, Wish, WishList, User]),
    AuthModule
  ]
})
export class StatsModule {}
