import { JwtService } from '@nestjs/jwt';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
export declare class AuthService {
    private userSerice;
    private jwtService;
    constructor(userSerice: UsersService, jwtService: JwtService);
    login(userDto: LoginUserDto): Promise<{
        token: string;
    }>;
    registartion(userDto: createUserDto): Promise<{
        token: string;
    }>;
    private generateToken;
    private validateUser;
}
