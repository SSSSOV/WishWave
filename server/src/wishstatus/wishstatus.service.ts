import { Injectable, NotFoundException } from '@nestjs/common';
import { WishStatus } from './wishstatus.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateWishStatusDto } from './dto/create-wishstatus.dto';

@Injectable()
export class WishstatusService {
    constructor(@InjectModel(WishStatus) private wishStatusRepository: typeof WishStatus) {}

    async create(dto: CreateWishStatusDto): Promise<WishStatus> {
        return this.wishStatusRepository.create(dto);
    }

    async getAll(): Promise<WishStatus[]> {
        return this.wishStatusRepository.findAll({include: {all: true}});
    }

    async getById(id: number): Promise<WishStatus> {
        const status = await this.wishStatusRepository.findByPk(id);
        if (!status) {
            throw new NotFoundException(`Статус желания с id ${id} не найден`);
        }
        return status;
    }
}
