import { createUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(userDto: LoginUserDto): Promise<{
        token: string;
    }>;
    registartion(userDto: createUserDto): Promise<{
        token: string;
    }>;
}
