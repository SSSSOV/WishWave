import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Friend } from './friend.model';
import { FriendStatus } from 'src/friendstatus/friendstatus.model';
import { User } from 'src/users/users.model';
import { Model, Op } from 'sequelize';
import { WishList } from 'src/wishlist/wishlist.model';
import { Wish } from 'src/wish/wish.model';
import { AccessLevel } from 'src/accesslevel/accesslevel.model';

@Injectable()
export class FriendService {
    constructor(@InjectModel(Friend) private readonly friendRepository: typeof Friend,
        @InjectModel(FriendStatus) private readonly statusRepository: typeof FriendStatus,
        @InjectModel(User) private readonly userRepository: typeof User) {}

    private async getStatusId(name: string): Promise<number> {
        const st = await this.statusRepository.findOne({where: {name}});
        if (!st) {
            throw new NotFoundException(`Статус не найден`)
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
        
        const incoming = await this.friendRepository.findOne({where: {sender: targetUserId, recipient: userId}});
        if (incoming) {
            const pendingId = await this.getStatusId('pending');
            const acceptedId = await this.getStatusId('accepted');

            if (incoming.friendstatusId === pendingId) {
                throw new BadRequestException('Пользователь уже отправил вам заявку в друзья')
            }
            if (incoming.friendstatusId === acceptedId) {
                throw new BadRequestException('Вы уже друзья с этим пользователем')
            }
        }

        const existing = await this.friendRepository.findOne({where: {sender: userId, recipient: targetUserId}});
        if (existing) {
            throw new BadRequestException('Заявка уже отправлена или вы явялетесь друзьями')
        }
        if (!you) {
            throw new NotFoundException('Отправитель не найден')
        }


        const pendingId = await this.getStatusId('pending');
        const fr = await this.friendRepository.create({sender: userId, recipient: targetUserId, friendstatusId: pendingId});

        const full = await this.friendRepository.findByPk(fr.id, {attributes: ['id', 'friendstatusId', 'createdAt', 'updatedAt'], include: [{model: User, as: 'senderUser', attributes: ['id', 'fullname', 'login', 'image']}, {model: User, as: 'recipientUser', attributes: ['id', 'fullname', 'login', 'image']}]});
        if (!full) {
            throw new NotFoundException('Не удалось загрузить созданную заявку')
        }

        return full;
    }

    async getReceivedRequests(userId: number) {
        const pendingId = await this.getStatusId('pending');
        return this.friendRepository.findAll({where: {recipient: userId, friendstatusId: pendingId}, include: [{model: User, as: 'senderUser', attributes: ['id','login','email','fullname','image']}, {model: User, as: 'recipientUser', attributes: ['id','login','email','fullname','image']}]});
    }

    async getSentRequest(userId: number) {
        const pendingId = await this.getStatusId('pending');
        return this.friendRepository.findAll({where: {sender: userId, friendstatusId: pendingId}, include: [{model: User, as: 'recipientUser', attributes: ['id','login','email','fullname','image']}, {model: User, as: 'senderUser', attributes: ['id','login','email','fullname','image']}]});
    }

    async acceptedRequest(userId: number, requestId: number) {
        const fr = await this.friendRepository.findByPk(requestId)
        if (!fr) {
            throw new NotFoundException('Заявка не найдена')
        }
        const pendingId = await this.getStatusId('pending');
        if (fr.friendstatusId !== pendingId) {
            throw new BadRequestException('Эту заявку уже обработали')
        }
        if (fr.recipient !== userId) {
            throw new ForbiddenException('Это не ваша входящая заявка')
        }
        fr.friendstatusId = await this.getStatusId('accepted');
        await fr.save();

        const full = await this.friendRepository.findByPk(fr.id, {attributes: ['id', 'friendstatusId', 'createdAt', 'updatedAt'], include: [{model: User, as: 'senderUser', attributes: ['id','login','email','fullname','image']}, {model: User, as: 'recipientUser', attributes: ['id','login','email','fullname','image']}]});
        if (!full) {
            throw new NotFoundException('Не удалось загрузить обновленную заявку')
        }

        return full;
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
        if (fr.recipient !== userId) {
            throw new ForbiddenException('Это не ваша входящая заявка')
        }
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
        if (fr.sender !== userId) {
            throw new ForbiddenException('Это не ваша исходящая заявка')
        }
        await fr.destroy();
        return {message: 'Заявка отменена'};
    }

    async getFriends(userId: number): Promise<Friend[]> {
        const acceptedId = await this.getStatusId('accepted');
        return this.friendRepository.findAll({ where: { friendstatusId: acceptedId, [Op.or]: [ { sender: userId }, { recipient: userId }]}, include: [
            { model: User, as: 'senderUser'}, { model: User, as: 'recipientUser'}]
        });
    }

    async unfriend(userId: number, requestId: number) {
        const fr = await this.friendRepository.findByPk(requestId);
        if (!fr) {
            throw new ForbiddenException('Дружба не найдена');
        }
        if (![fr.sender, fr.recipient].includes(userId)) {
            throw new ForbiddenException('Вы не участник этой дружбы')
        }
        await fr.destroy();
        return {message: 'Вы больше не друзья'};
    }

    async unfriendByUserId(me: number, friendUserId: number): Promise<{message: string}> {
        const acceptedId = await this.getStatusId('accepted');
        const fr = await this.friendRepository.findOne({where: {friendstatusId: acceptedId, [Op.or]: [{sender: me, recipient: friendUserId},{sender: friendUserId, recipient: me}]}});
        if (!fr){
            throw new ForbiddenException('Дружба не найдена');
        }

        await fr.destroy();
        return {message: `Вы больше не друзья`}
    }

    async areFriends(userA: number, userB: number): Promise<boolean> {
        const acceptedId = await this.getStatusId('accepted');
        const fr = await this.friendRepository.findOne({where: {friendstatusId: acceptedId, [Op.or]: [
            {sender: userA, recipient: userB}, {sender: userB, recipient: userA}
        ]}});
        return !!fr;
    }

    async getFriendsByLastActivity(userId: number) {
        const acceptedId = await this.getStatusId('accepted');

        const raw = await this.friendRepository.findAll({where: {friendstatusId: acceptedId, [Op.or]: [{ sender: userId }, { recipient: userId }],}, attributes: ['sender','recipient'], raw: true});
        const friendIds = Array.from(new Set(raw.map(r => r.sender === userId ? r.recipient : r.sender)));
        if (!friendIds.length) {
            return [];
        }

        const friends = await this.userRepository.findAll({ where: { id: friendIds }, include: [{model: WishList, as: 'wishlist', include: [ { model: AccessLevel, as: 'accesslevel', attributes: ['name'] }, { model: Wish, as: 'wishes' }]}]});
        type PlainWL = { createdAt: Date; wishes?: Array<{ createdAt: Date }>; accesslevel?: { name: string }};
        const plain = friends.map(f => f.get({ plain: true }) as any & { wishlist: PlainWL[] });
        const withActivity = plain.map(u => {const allowed = u.wishlist.filter(wl => wl.accesslevel?.name === 'public' || wl.accesslevel?.name === 'friends');
            const timestamps = [ ...allowed.map(wl => wl.createdAt.getTime()), ...allowed.flatMap(wl => (wl.wishes ?? []).map(w => w.createdAt.getTime()))];
            if (!timestamps.length) {
                return null;
            }

            return { user: u,lastActivity: new Date(Math.max(...timestamps))};
        }).filter((x): x is { user: typeof plain[0]; lastActivity: Date } => x != null).sort((a,b) => b.lastActivity.getTime() - a.lastActivity.getTime());

        return withActivity;
    }
}
