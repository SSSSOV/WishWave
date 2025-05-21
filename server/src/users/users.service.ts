import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { createUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';
import { Wish } from 'src/wish/wish.model';
import { WishStatus } from 'src/wishstatus/wishstatus.model';
import { WishList } from 'src/wishlist/wishlist.model';
import { FileService } from 'src/file/file.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User, private roleService: RolesService, private fileService: FileService) {}

    async createUser(dto: createUserDto) {
        const role = await this.roleService.getRoleByValue("user");

        if (!role) {
            throw new Error('Role "user" not found');
        }

        const user = await this.userRepository.create({...dto, roleId: role.id,});

        user.role = role;

        return user;
    }

    async updateUser(id:number, dto: UpdateUserDto, image?: Express.Multer.File): Promise<User> {
        const user = await this.userRepository.findByPk(id);
        if (!user) {
            throw new Error('Пользователь не найден');
        }

        if (image) {
            const filename = await this.fileService.createFile(image);
            dto.image = filename;
        }

        await user.update(dto as any);
        return user;
    }

    async getAllUsers(){
        const users = await this.userRepository.findAll({include: {all: true}});
        if (!users) {
            throw Error('пользователи не найдены')
        }
        return users;
    }
    
    async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.findByPk(id, {attributes: {exclude: ['password']}, include: [{
            model: WishList, as: 'wishlist', include: [{
                model: Wish, through: {attributes: []}, include: [{
                    model: WishStatus, attributes: ['id', 'name']
                }]
            }] 
        }]});
        if (!user) {
            throw Error('пользователь не найден (id)')
        }
        return user;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}})
        return user;
    }

    async getUserByLogin(login: string) {
        const user = await this.userRepository.findOne({where: {login}, include: {all: true}})
        return user;
    }

    async deleteUserById(userId: number) {
        const user = await this.userRepository.findByPk(userId);
        
        if (!user) {
            throw new Error('Пользователь не найден');
        }

        const login = user.login;

        await user.destroy();
        return { message: `Пользователь ${login} с ID ${userId} удалён` };
    }

    async updatePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
        const user = await this.userRepository.findByPk(userId);
        if (!user) {
            throw new BadRequestException('Пользователь не найден');
        }

        const matches = await bcrypt.compare(oldPassword, user.password);
        if (!matches) {
            throw new BadRequestException('Старый пароль неверен');
        }

        const hash = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hash });
    }
}
