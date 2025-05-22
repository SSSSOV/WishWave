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
import { WishStatus } from 'src/wishstatus/wishstatus.model';
import { WishListWish } from './wishlist-wish.model';

@Injectable()
export class WishlistService {
    constructor(@InjectModel(WishList) private wishListRepository: typeof WishList, 
        @InjectModel(Friend) private friendRepository: typeof Friend, 
        @InjectModel(Wish) private wishRepository: typeof Wish,
        @InjectModel(WishListWish) private wishListWishRepository: typeof WishListWish) {}

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

    async getWishesByListId(userId: number, wishlistId: number) {
        const links = await this.wishListWishRepository.findAll({
            where: { wishlistId },
            raw: true,
        });
        console.log('↪️ LINKS FOR LIST', wishlistId, links);

        const wishlist = await this.wishListRepository.findByPk(wishlistId, {include: [
            { model: Wish, as: 'wishes', through: { attributes: [] }, include: [{model: WishStatus, attributes: ['id', 'name']}] },
            { model: AccessLevel, as: 'accesslevel' }, 
            { model: User, as: 'user' }                 
        ]})

        console.log('↪️ WISHLIST AFTER FIND:', wishlist?.get({ plain: true }));
        if(!wishlist) {
            throw new NotFoundException('Список желаний не найден');
        }

        const canAccess = await this.canAccessWishList(userId, wishlistId);
        if (!canAccess) {
            throw new ForbiddenException('Доступ к списку запрещен');
        }

        const plain = wishlist.get({plain: true});
        return plain.wishes as Wish[];
    }

    async update(wishlistId: number, dto: Partial<CreateWishlistDto>): Promise<WishList> {
        const wl = await this.wishListRepository.findByPk(wishlistId);
        if (!wl) {
            throw new NotFoundException('Список не найден');
        }
        await wl.update(dto);
        return wl;
    }

    async remove(wishlistId: number): Promise<{message: string}> {
        const wl = await this.wishListRepository.findByPk(wishlistId);
        if (!wl) {
            throw new NotFoundException('Список не найден');
        }
        await wl.destroy();
        return {message: `Список ${wishlistId} удален`}
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

    async isOwner(userId: number, wishlistId: number): Promise <boolean> {
        const wl = await this.wishListRepository.findByPk(wishlistId, {attributes: ['userId']});
        if (!wl) {
            throw new NotFoundException('Список не найден');
        }
        return wl.userId === userId;
    }

    async duplicate(userId: number, wishId: number, targetListId: number): Promise<Wish> {
        if(!(await this.isOwner(userId, targetListId))) {
            throw new ForbiddenException('Вы не можете копировать желание в чужой список')
        }

        const origin = await this.wishListWishRepository.findOne({where: {wishId}, attributes: ['wishlistId']});
        if (!origin) {
            throw new NotFoundException('Желание не найдено ни в одном списке')
        }

        const already = await this.wishListWishRepository.findOne({where: {wishId, wishlistId: targetListId}});
        if (already) {
            throw new ForbiddenException('Желание уже есть в целевом списке')
        }

        const originalWish = await this.wishRepository.findByPk(wishId);
        if(!originalWish) {
            throw new NotFoundException('Желание не найдено')
        }

        const cloned = await this.wishRepository.create({
            name: originalWish.name,
            price: originalWish.price,
            image: originalWish.image,
            productLink: originalWish.productLink,
            wishStatusId: 1,
            bookedByUserId: null
        });

        await this.wishListWishRepository.create({wishlistId: targetListId, wishId: cloned.id});

        return cloned;
    }

}
