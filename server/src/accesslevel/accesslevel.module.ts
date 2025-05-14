import { Module } from '@nestjs/common';
import { AccesslevelController } from './accesslevel.controller';
import { AccesslevelService } from './accesslevel.service';

@Module({
  controllers: [AccesslevelController],
  providers: [AccesslevelService]
})
export class AccesslevelModule {}
