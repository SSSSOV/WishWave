import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AccessLevel } from './accesslevel.model';

@Injectable()
export class AccesslevelService {
    constructor(@InjectModel(AccessLevel) private accessLevelRepository: typeof AccessLevel) {}

    async create(name: string): Promise <AccessLevel> {
        const existing = await this.accessLevelRepository.findOne({where: {name}});
        return this.accessLevelRepository.create({name});
    }
}
