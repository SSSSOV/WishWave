import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import { LoginUserDto } from 'src/users/dto/login-user.dto';

@Injectable()
export class AuthService {

    constructor(private userSerice: UsersService, private jwtService: JwtService) {}

    async login(userDto: LoginUserDto){
        const user = await this.validateUser(userDto)
        return this.generateToken(user)
    }
    
    async registartion(userDto: createUserDto) {
        const candidateByEmail = await this.userSerice.getUserByEmail(userDto.email);
        if (candidateByEmail) {
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST)
        }

        const candidateByLogin = await this.userSerice.getUserByLogin(userDto.login);
        if (candidateByLogin) {
            throw new HttpException('Пользователь с таким login существует', HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userSerice.createUser({...userDto, password: hashPassword})
        return this.generateToken(user)
    }

    private async generateToken(user) {
        const payload = {login: user.login, id: user.id, email: user.email, full_name: user.full_name,roles: user.role}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: LoginUserDto) {
        let user = await this.userSerice.getUserByEmail(userDto.loginOrEmail);

        if (!user) {
            user = await this.userSerice.getUserByLogin(userDto.loginOrEmail);
        }

        if (!user) {
            throw new UnauthorizedException({ message: 'Некорректный email, логин или пароль' });
        }

        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Некорректный email, логин или пароль'})
    }
}
