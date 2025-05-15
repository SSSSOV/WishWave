import { Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { createUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User, private roleService: RolesService) {

    }
    async createUser(dto: createUserDto){
        const user = await this.userRepository.create(dto);
        const role = await this.roleService.getRoleByValue("USER")

        if (!role) {
            throw new Error('Role "USER" not found');
        }

        await user.$set('roles', [role.id])
        return user;
    }

    async getAllUsers(){
        const users = await this.userRepository.findAll({include: {all: true}});
        return users;
    }
}
