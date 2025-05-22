import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './roles.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
  providers: [RolesService, JwtAuthGuard],
  controllers: [RolesController],
  imports: [
    SequelizeModule.forFeature([Role, User]),
    AuthModule
  ],
  exports: [
    RolesService
  ]
})
export class RolesModule {}
