import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Friend } from './friend.model';
import { FriendUsers } from './friend-users.model';
import { FriendStatus } from 'src/friendstatus/friendstatus.model';
import { User } from 'src/users/users.model';
import { Op } from 'sequelize';

@Injectable()
export class FriendService {
    constructor(@InjectModel(Friend) private readonly friendRepository: typeof Friend,
        @InjectModel(FriendUsers) private readonly linkRepository: typeof FriendUsers,
        @InjectModel(FriendStatus) private readonly statusRepository: typeof FriendStatus,
        @InjectModel(User) private readonly userRepository: typeof User) {}

    private async getStatusId(name: string): Promise<number> {
        const st = await this.statusRepository.findOne({where: {name}});
        if (!st) {
            throw new NotFoundException(`Статус ${name} не найден`)
        }
        return st.id;
    }

    async sendRequest(userId: number, targetUserId: number) {
        if (userId === targetUserId) {
            throw new BadRequestException('Нельзя отправить заявку самому себе')
        }

        const [you, target] = await Promise.all([this.userRepository.findByPk(userId), this.userRepository.findByPk(targetUserId)]);
        if (!target) {
            throw new NotFoundException('Целевой пользователь не найден')
        }

        const existing = await this.friendRepository.findOne({where: {userid1: userId, userid2: targetUserId}});
        if (existing) {
            throw new BadRequestException('Заявка уже отправлена или вы явялетесь друзьями')
        }
        if (!you) {
            throw new NotFoundException('Отправитель не найден')
        }

        const pendingId = await this.getStatusId('pending');
        const fr = await this.friendRepository.create({userid1: userId, userid2: targetUserId, friendstatusId: pendingId});

        await Promise.all([this.linkRepository.create({userId, friendId: fr.id}), this.linkRepository.create({userId: targetUserId, friendId: fr.id})]);

        return fr;

    }

    async getReceivedRequests(userId: number) {
        const pendingId = await this.getStatusId('pending');
        return this.friendRepository.findAll({where: {userid2: userId, friendstatusId: pendingId}, include: [{model: User, as: 'users', through: {attributes: []}}]});
    }

    async getSentRequest(userId: number) {
        const pendingId = await this.getStatusId('pending');
        return this.friendRepository.findAll({where: {userid1: userId, friendstatusId: pendingId}, include: [{model: User, as: 'users', through: {attributes: []}}]});
    }

    async acceptedRequest(userId: number, requestId: number) {
        const fr = await this.friendRepository.findByPk(requestId)
        if (!fr) {
            throw new ForbiddenException('Заявка не найдена')
        }
        const pendingId = await this.getStatusId('pending');
        if (fr.friendstatusId !== pendingId) {
            throw new BadRequestException('Эту заявку уже обработали')
        }
        if (fr.userid2 !== userId) {
            throw new ForbiddenException('Это не ваша входящая заявка')
        }
        fr.friendstatusId = await this.getStatusId('accepted');
        return fr.save();
    }

    async rejectRequest(userId: number, requestId: number) {
        const fr = await this.friendRepository.findByPk(requestId);
        if (!fr) {
            throw new NotFoundException('Заявка не найдена')
        }
        const pendingId = await this.getStatusId('pending');
        if (fr.friendstatusId !== pendingId) {
            throw new BadRequestException('Эту заявку уже обработали')
        }
        if (fr.userid2 !== userId) {
            throw new ForbiddenException('Это не ваша входящая заявка')
        }
        await this.linkRepository.destroy({where: {friendId: requestId}});
        await fr.destroy();
        return {message: 'Заявка отклонена и удалена'}
    }

    async cancelRequest(userId: number, requestId: number) {
        const fr = await this.friendRepository.findByPk(requestId);
        if (!fr) {
            throw new NotFoundException('Заявка не найдена')
        }
        const pendingId = await this.getStatusId('pending') 
        if (fr.friendstatusId !== pendingId) {
            throw new BadRequestException('Нельзя отменять заявку после её обработки')
        }
        if (fr.userid1 !== userId) {
            throw new ForbiddenException('Это не ваша исходящая заявка')
        }
        await this.linkRepository.destroy({where: {friendId: requestId}});
        await fr.destroy();
        return {message: 'Заявка отменена'};
    }

    async getFriends(userId: number) {
        const acceptedId = await this.getStatusId('accepted');
        const links = await this.linkRepository.findAll({where: {userId}});
        const friendIds = links.map(l => l.friendId);
        if (friendIds.length === 0) {
            return [];
        }

        const rows = await this.friendRepository.findAll({where: {id: friendIds, friendstatusId: acceptedId}});

        return Promise.all(rows.map(fr => {
            const otherId = fr.userid1 === userId ? fr.userid2 : fr.userid1;
            return this.userRepository.findByPk(otherId);
        }));
    }

    async unfriend(userId: number, requestId: number) {
        const fr = await this.friendRepository.findByPk(requestId);
        if (!fr) {
            throw new ForbiddenException('Дружба не найдена');
        }
        if (![fr.userid1, fr.userid2].includes(userId)) {
            throw new ForbiddenException('Вы не участник этой дружбы')
        }
        await this.linkRepository.destroy({where: {friendId: requestId}});
        await fr.destroy();
        return {message: 'Вы больше не друзья'};
    }

    async areFriends(userA: number, userB: number): Promise<boolean> {
        const acceptedId = await this.getStatusId('accepted');
        const fr = await this.friendRepository.findOne({where: {friendstatusId: acceptedId, [Op.or]: [
            {userid1: userA, userid2: userB}, {userid1: userB, userid2: userA}
        ]}});
        return !!fr;
    }
}
