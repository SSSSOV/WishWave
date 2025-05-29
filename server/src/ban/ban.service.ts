import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Ban } from './ban.model';
import { User } from 'src/users/users.model';

@Injectable()
export class BanService {

    constructor(@InjectModel(Ban) private banRepository: typeof Ban, @InjectModel(User) private userRepository: typeof User) {}
    
    async banUser(userId: number, description: string) {
        const user = await this.userRepository.findByPk(userId);

        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        const ban = await this.banRepository.create({description});
        await this.userRepository.update({ banId: ban.id }, { where: { id: userId } });

        return {message: `Пользователь забанен`, ban};
    }

    async unbanUser(banId: number) {
        const ban = await this.banRepository.findByPk(banId);
        if (!ban) {
            throw new NotFoundException(`Бан не найден`)
        }
        await this.userRepository.update({banId: null}, {where: {banId}});

        await ban.destroy();
        return {message: `Бан удален`};
    }

    async getAllBans(): Promise<Ban[]> {
        return this.banRepository.findAll();
    }

    async getBanById(banId: number): Promise<Ban> {
        const ban = await this.banRepository.findByPk(banId);
        if (!ban) {
            throw new NotFoundException(`Ban не найден`)
        }
        return ban;
    }
}
