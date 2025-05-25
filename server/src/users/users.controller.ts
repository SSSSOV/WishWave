import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserResponseDto } from './dto/user-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FriendService } from 'src/friend/friend.service';

@Controller('user')
export class UsersController {

    constructor(private readonly usersService: UsersService, private fileService: FileService, private readonly friendService: FriendService) { }

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
    @Get('search')
    async findByEmailOrLogin(@Req() req, @Query('email') email?: string, @Query('login') login?: string): Promise<UserResponseDto> {
        if (!email && !login) {
            throw new BadRequestException('Укажите email или login')
        }

        let user;
        if (email) {
            user = await this.usersService.getUserByEmail(email);
        } else {
            user = await this.usersService.getUserByLogin(login!);
        }

        if(!user) {
            throw new BadRequestException('Пользователь не найден')
        }

        const plain = user.get({plain: true}) as any;
        const {password, wishlist, ...rest} = plain;
        const dto: UserResponseDto = {...rest, wishlists: Array.isArray(wishlist) ? wishlist: []};

        return dto;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<UserResponseDto> {
        const userRole = req.user.roles?.value;
        const userId = req.user.id;

        if (userRole !== 'admin' && userId !== id) {
            const friends = await this.friendService.areFriends(userId, id);
            if (!friends) {
                throw new ForbiddenException('Профиль доступен только друзьям');
        
            }
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
    @UseInterceptors(FileInterceptor('image', {limits: {fileSize: 2 * 1024 * 1024}}))
    async updateUser(@Param('id', ParseIntPipe) id: number, @UploadedFile() image: Express.Multer.File, @Body() dto: UpdateUserDto, @Req() req): Promise<UserResponseDto> {
        if (req.user.id !== id) {
            throw new ForbiddenException('Можно редактировать только свой профиль')
        }
        const updated = await this.usersService.updateUser(id, dto, image);
        const plain = updated.get({plain: true}) as any;
        const {password, wishlist, ...rest} = plain;
        return {...rest, wishlists: Array.isArray(wishlist) ? wishlist: []};
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/password')
    async changePassword(@Param('id', ParseIntPipe) id: number, @Body() dto: ChangePasswordDto, @Req() req) {
        if (req.user.id !== id) {
            throw new ForbiddenException('Нельзя менять пароль у другого пользователя')
        }
        if (dto.newPassword !== dto.confirmPassword) {
            throw new BadRequestException('Новые пароли не совпадают')
        }
        await this.usersService.updatePassword(id, dto.oldPassword, dto.newPassword);
        return {message: 'Пароль успешно изменен'};
    }
}
