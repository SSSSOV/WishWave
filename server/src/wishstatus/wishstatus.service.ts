import { Injectable, NotFoundException } from '@nestjs/common';
import { WishStatus } from './wishstatus.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateWishStatusDto } from './dto/create-wishstatus.dto';
import { UpdateWishStatusDto } from './dto/update-wishstatus.dto';

@Injectable()
export class WishstatusService {
    constructor(@InjectModel(WishStatus) private wishStatusRepository: typeof WishStatus) {}

    async create(dto: CreateWishStatusDto): Promise<WishStatus> {
        return this.wishStatusRepository.create(dto);
    }

    async getAll(): Promise<WishStatus[]> {
        return this.wishStatusRepository.findAll();
    }

    async getById(id: number): Promise<WishStatus> {
        const status = await this.wishStatusRepository.findByPk(id);
        if (!status) {
            throw new NotFoundException(`Статус желания с id ${id} не найден`);
        }
        return status;
    }

    async update (id: number, dto: UpdateWishStatusDto): Promise<WishStatus> {
        const status = await this.getById(id);
        await status.update(dto);
        return status;
    }

    async remove(id: number): Promise<void> {
        const status = await this.getById(id);
        await status.destroy();
    }

}
