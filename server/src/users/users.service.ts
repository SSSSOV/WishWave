import { Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { createUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User, private roleService: RolesService) {}

    async createUser(dto: createUserDto) {
        const role = await this.roleService.getRoleByValue("user");

        if (!role) {
            throw new Error('Role "user" not found');
        }

        const user = await this.userRepository.create({...dto, roleId: role.id,});

        user.role = role;

        return user;
    }

    async updateUser(id:number, dto: Partial<createUserDto>) {
        const user = await this.userRepository.findByPk(id);
        if (!user) {
            throw new Error('Пользователь не найден');
        }

        await user.update(dto);
        return user;
    }

    async getAllUsers(){
        const users = await this.userRepository.findAll({include: {all: true}});
        if (!users) {
            throw Error('пользователи не найдены')
        }
        return users;
    }
    
    async getUserById(id: number) {
        const user = await this.userRepository.findByPk(id, {include: {all: true}});
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
}
