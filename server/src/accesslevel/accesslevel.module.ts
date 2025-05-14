import { Module } from '@nestjs/common';
import { AccesslevelController } from './accesslevel.controller';
import { AccesslevelService } from './accesslevel.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccessLevel } from './accesslevel.model';
import { WishList } from 'src/wishlist/wishlist.model';

@Module({
  controllers: [AccesslevelController],
  providers: [AccesslevelService],
  imports: [
    SequelizeModule.forFeature([AccessLevel, WishList]),
  ]
})
export class AccesslevelModule {}
