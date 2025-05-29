import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AccessLevel } from './accesslevel.model';

@Injectable()
export class AccesslevelService {
    constructor(@InjectModel(AccessLevel) private accessLevelRepository: typeof AccessLevel) {}

    async create(name: string): Promise <AccessLevel> {
        return this.accessLevelRepository.create({name});
    }

    async findAll(): Promise<AccessLevel[]> {
        return this.accessLevelRepository.findAll();
    }

    async findById(id: number): Promise<AccessLevel> {
        const lvl = await this.accessLevelRepository.findByPk(id);
        if (!lvl) {
            throw new NotFoundException(`Уровень доступа не найден`)
        }
        return lvl;
    }

    async update(id: number, name: string): Promise<AccessLevel> {
        const lvl = await this.findById(id);
        await lvl.update({name});
        return lvl;
    }

    async remove(id: number): Promise<{message: string}> {
        const lvl = await this.findById(id);
        await lvl.destroy();
        return {message: `Уровень доступа удален`};
    }
}
