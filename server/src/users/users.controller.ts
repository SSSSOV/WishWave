import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { createUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(@Req() req): Promise<UserResponseDto[]> {
        if (req.user.roles?.value !== 'admin') {
            throw new ForbiddenException('У вас нет прав, чтобы посмотреть всех пользователей')
        }
        const users = await this.usersService.getAllUsers();
        return users.map(u => {const plain = u.get({plain: true}) as any;
            const {password, wishlist, ...rest} = plain;
            const dto: UserResponseDto = {...rest, wishlists: Array.isArray(wishlist) ? wishlist: []}
            return dto;
    })
    } 

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<UserResponseDto> {
        const userRole = req.user.roles?.value;
        const userId = req.user.id;

        if (userRole !== 'admin' && userId !== id) {
            throw new ForbiddenException('Можно смотреть только свой профиль');
        }
        const user = await this.usersService.getUserById(id);
        const plain = user.get({plain: true}) as any;

        const {password, wishlist, ...rest} = plain;

        const dto: UserResponseDto = {...rest, wishlists: Array.isArray(wishlist) ? wishlist: []};

        return dto;
    }
    
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async removeUser(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<{message: string}> {
        const userRole = req.user.roles?.value;
        const userId = req.user.id;
        if (userRole !== 'admin' && userId !== id) {
            throw new ForbiddenException('Можно удалить только свой аккаунт')
        }
        return this.usersService.deleteUserById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateUser(@Param('id', ParseIntPipe) id: number,@Body() dto: Partial<createUserDto>, @Req() req): Promise<UserResponseDto> {
        if (req.user.id !== id) {
            throw new ForbiddenException('Можно редактировать только свой профиль')
        }
        const updated = await this.usersService.updateUser(id, dto);
        const plain = updated.get({plain: true}) as any;
        const {password, wishlist, ...rest} = plain;
        return {...rest, wishlists: Array.isArray(wishlist) ? wishlist: []} as UserResponseDto;
    }
}
