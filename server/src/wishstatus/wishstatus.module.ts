import { Module } from '@nestjs/common';
import { WishstatusController } from './wishstatus.controller';
import { WishstatusService } from './wishstatus.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { WishStatus } from './wishstatus.model';
import { Wish } from 'src/wish/wish.model';
import { User } from 'src/users/users.model';

@Module({
  controllers: [WishstatusController],
  providers: [WishstatusService],
  imports: [
    SequelizeModule.forFeature([WishStatus, Wish, User]),
  ]
})
export class WishstatusModule {}
