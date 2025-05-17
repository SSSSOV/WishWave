import { JwtService } from '@nestjs/jwt';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
export declare class AuthService {
    private userSerice;
    private jwtService;
    constructor(userSerice: UsersService, jwtService: JwtService);
    login(userDto: createUserDto): Promise<void>;
    registartion(userDto: createUserDto): Promise<{
        token: string;
    }>;
    generateToken(user: any): Promise<{
        token: string;
    }>;
}
