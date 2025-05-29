import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FriendStatus } from './friendstatus.model';
import { CreateFriendStatusDto } from './dto/create-friend-status.dto';
import { UpdateFriendStatusDto } from './dto/update-friend-status.dto';

@Injectable()
export class FriendstatusService {
    constructor(@InjectModel(FriendStatus) private readonly friendStatusModel: typeof FriendStatus) {}

    async create(dto: CreateFriendStatusDto): Promise<FriendStatus> {
        return await this.friendStatusModel.create({...dto});
    }

    async getAll(): Promise<FriendStatus[]> {
        return this.friendStatusModel.findAll();
    }

    async getById(id: number): Promise<FriendStatus> {
        const status = await this.friendStatusModel.findByPk(id);
        if (!status) {
            throw new NotFoundException(`Статус дружбы не найден`);
        }

        return status;
    }

    async findByName(name: string): Promise<FriendStatus | null> {
        return this.friendStatusModel.findOne({where: {name}})
    }

    async update(id: number, dto: UpdateFriendStatusDto): Promise<FriendStatus> {
        const status = await this.friendStatusModel.findByPk(id);
        if (!status) {
            throw new NotFoundException('Статус дружбы не найден');
        }
        await status.update({name: dto.name});
        return status;
    }

    async remove(id: number): Promise<{message: string}> {
        const status = await this.getById(id);
        if (!status) {
            throw new NotFoundException('Статус дружбы не найден')
        }
        await status.destroy();
        return {message: `Статус дружбы удален`};
    }
}
