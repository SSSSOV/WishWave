import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WishList } from './wishlist.model';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Wish } from 'src/wish/wish.model';
import { AccessLevel } from 'src/accesslevel/accesslevel.model';
import { User } from 'src/users/users.model';
import { Op } from 'sequelize';
import { Friend } from 'src/friend/friend.model';
import { FriendUsers } from 'src/friend/friend-users.model';
import { FriendStatus } from 'src/friendstatus/friendstatus.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WishlistService {
    constructor(@InjectModel(WishList) private wishListRepository: typeof WishList, @InjectModel(Friend) private friendRepository: typeof Friend) {}

    async create(dto: CreateWishlistDto, userId: number) {
        let shareToken: string | null = null;

        if (dto.accesslevelId === 3) {
            shareToken = uuidv4();
        }

        const list = await this.wishListRepository.create({...dto, userId, shareToken});
        return list;
    }

    async getAllByUser(userId: number) {
        return await this.wishListRepository.findAll({where: {userId}, include: [{model: Wish, through: {attributes: []}}]});
    }

    async findByIdWithAccess(id: number) {
        return await this.wishListRepository.findByPk(id, {include: [AccessLevel]});
    }

    async canAccessWishList(userId: number | null, wishlistId: number, shareToken?: string): Promise<boolean> {
        const wishlist = await this.wishListRepository.findOne({
            where: { id: wishlistId },
            attributes: ['id', 'userId', 'shareToken'],
            include: [{
            model: AccessLevel,
            as: 'accesslevel',
            attributes: ['name'],
            required: true
            }]
        });

        if (!wishlist) {
            throw new NotFoundException('Список желаний не найден или уровень доступа не найден');
        }

        if (userId !== null && wishlist.userId === userId) {
            return true;
        }

        const plain = wishlist.get({plain: true}) as{
            id:number;
            shareToken?: string;
            accesslevel: {name: string};
        };

        if(!plain.accesslevel) {
            throw new NotFoundException('Не найден уровень доступа для этого списка');
        }

        const level = plain.accesslevel.name;
        switch (level) {
            case 'public':
                return userId !== null;
            case 'private':
                return false;
            case 'linkOnly':
                if (!plain.shareToken || shareToken !== plain.shareToken) {
                    return false;
                }
                return true;
            case 'friends':
                const relation = await this.friendRepository.findOne({
                    include: [
                    { model: FriendUsers, where: { userId } },
                    { model: FriendUsers, where: { userId: wishlist.userId } },
                    { model: FriendStatus, where: { name: { [Op.or]: ['accepted', 'друзья'] } } },
                    ]
                });
                return Boolean(relation);
            default:
                return false;
        }
    }


    async getWishesByListId(userId: number, wishlistId: number) {
        const wishlist = await this.wishListRepository.findByPk(wishlistId, {include: [
            { model: Wish, through: { attributes: [] } },
            { model: AccessLevel, as: 'accesslevel' }, 
            { model: User, as: 'user' }                 
        ]})

        if(!wishlist) {
            throw new NotFoundException('Список желаний не найден');
        }

        const canAccess = await this.canAccessWishList(userId, wishlistId);
        if (!canAccess) {
            throw new ForbiddenException('Доступ к списку запрещен');
        }

        return wishlist.wishes;
    }
}
