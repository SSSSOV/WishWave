import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {

    constructor(private userSerice: UsersService, private jwtService: JwtService) {}

    async login(userDto: createUserDto){
        const user = await this.validateUser(userDto)
        return this.generateToken(user)
    }
    
    async registartion(userDto: createUserDto) {
        const candidate = await this.userSerice.getUserByEmail(userDto.email);
        if (candidate) {
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userSerice.createUser({...userDto, password: hashPassword})
        return this.generateToken(user)
    }

    private async generateToken(user) {
        const payload = {login: user.login, id: user.id, roles: user.role}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: createUserDto) {
        const user = await this.userSerice.getUserByEmail(userDto.email);

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
