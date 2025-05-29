import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ProfanityModule } from 'src/profanity/profanity.module';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  providers: [AuthService, JwtAuthGuard],
  controllers: [AuthController],
  imports: [
    ProfanityModule,
    forwardRef(() => UsersModule),
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
