import { Module } from '@nestjs/common';
import { FriendstatusService } from './friendstatus.service';
import { FriendstatusController } from './friendstatus.controller';

@Module({
  providers: [FriendstatusService],
  controllers: [FriendstatusController]
})
export class FriendstatusModule {}
