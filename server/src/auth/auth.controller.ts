import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

class VerifyDto {
  loginOrEmail: string;
  code: string;
}

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/login')
    login(@Body() userDto: LoginUserDto){
        return this.authService.login(userDto)
    }

    @Post("/registration")
    async registration(@Body() userDto: createUserDto) {
        return this.authService.registration(userDto);
    }

    @Post("/verify-email")
    async verifyEmail(@Body() dto: VerifyDto) {
        return this.authService.verifyEmail(dto.loginOrEmail, dto.code);
    }
}
