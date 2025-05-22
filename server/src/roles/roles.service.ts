import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.model';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {

    constructor(@InjectModel(Role) private readonly roleRepository: typeof Role) {}

    async createRole(dto: CreateRoleDto) {
        return this.roleRepository.create(dto);
    }

    async getAllRoles(): Promise<Role[]> {
        return this.roleRepository.findAll();
    }

    async getRoleByValue(value: string) {
        return this.roleRepository.findOne({where: {value}});
    }

    async updateRole(id: number, dto: UpdateRoleDto): Promise<Role> {
        const role = await this.roleRepository.findByPk(id);
        if(!role) {
            throw new NotFoundException(`Роль с id ${id} не найдена`);
        }
        await role.update(dto);
        return role;
    }

    async deleteRole(id: number): Promise<{message: string}> {
        const role = await this.roleRepository.findByPk(id);
        if (!role) {
            throw new NotFoundException(`Роль с id ${id} не найдена`);
        }
        await role.destroy();
        return {message: `Роль ${role.value} удалена`}
    }
}
