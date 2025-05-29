import { Module } from '@nestjs/common';
import { BugreportService } from './bugreport.service';
import { BugreportController } from './bugreport.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { BugReport } from './bugreport.model';
import { AuthModule } from 'src/auth/auth.module';
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';

@Module({
  providers: [BugreportService, OptionalJwtAuthGuard],
  controllers: [BugreportController],
  imports: [
    SequelizeModule.forFeature([BugReport]),
    AuthModule
  ]
})
export class BugreportModule {}
