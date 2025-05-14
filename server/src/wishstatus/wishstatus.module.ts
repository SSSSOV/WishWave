import { Module } from '@nestjs/common';
import { WishstatusController } from './wishstatus.controller';
import { WishstatusService } from './wishstatus.service';

@Module({
  controllers: [WishstatusController],
  providers: [WishstatusService]
})
export class WishstatusModule {}
