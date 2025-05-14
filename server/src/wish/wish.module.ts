import { Module } from '@nestjs/common';
import { WishService } from './wish.service';
import { WishController } from './wish.controller';

@Module({
  providers: [WishService],
  controllers: [WishController]
})
export class WishModule {}
