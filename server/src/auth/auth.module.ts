import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ProfanityModule } from 'src/profanity/profanity.module';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PendingUser } from './pending-user.model';
import { MailerModule } from 'src/mailer/mailer.module';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  providers: [AuthService, JwtAuthGuard, PendingUser],
  controllers: [AuthController],
  imports: [
    SequelizeModule.forFeature([PendingUser]),
    ProfanityModule,
    forwardRef(() => UsersModule),
    MailerModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h'
      }
    })
  ],
  exports: [
    AuthService,
    JwtModule,
    JwtAuthGuard
  ]
})
export class AuthModule {}