import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WishList } from './wishlist.model';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Wish } from 'src/wish/wish.model';
import { AccessLevel } from 'src/accesslevel/accesslevel.model';
import { User } from 'src/users/users.model';
import { Op } from 'sequelize';
import { Friend } from 'src/friend/friend.model';
import { FriendStatus } from 'src/friendstatus/friendstatus.model';
import { v4 as uuidv4 } from 'uuid';
import { WishStatus } from 'src/wishstatus/wishstatus.model';
import { WishListWish } from './wishlist-wish.model';

@Injectable()
export class WishlistService {
    constructor(@InjectModel(WishList) private wishListRepository: typeof WishList, 
        @InjectModel(Friend) private friendRepository: typeof Friend, 
        @InjectModel(Wish) private wishRepository: typeof Wish,
        @InjectModel(WishListWish) private wishListWishRepository: typeof WishListWish,
        @InjectModel(FriendStatus) private statusRepository: typeof FriendStatus) {}

    private async getStatusId(name: string): Promise<number> {
        const st = await this.statusRepository.findOne({where: {name}});
        if(!st) {
            throw new NotFoundException(`Статус дружбы ${name} не найден`);
        }
        return st.id
    }

    private normalizeData(input?: string): string | undefined {
        if (!input) {
            return undefined;
        }
        if(/^\d{4}-\d{2}-\d{2}$/.test(input)) {
            return input;
        }

        const match = input.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
        if (!match) {
            throw new BadRequestException(`Неподдерживаемый формат даты: ${input}. Ожидается dd.mm.yyyy`)
        }

        const [, dd, mm, yyyy] = match;
        return `${yyyy}-${mm}-${dd}`;
    }

    async create(dto: CreateWishlistDto, userId: number) {
        let shareToken: string | null = null;

        dto.eventDate = this.normalizeData(dto.eventDate);

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

        const wishlist = await this.wishListRepository.findByPk(wishlistId, {include: [
            { model: Wish, as: 'wishes', through: { attributes: [] }, include: [{model: WishStatus, attributes: ['id', 'name']}] },
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

        const plain = wishlist.get({plain: true});
        return plain.wishes as Wish[];
    }

    async update(wishlistId: number, dto: Partial<CreateWishlistDto>): Promise<WishList> {
        const wl = await this.wishListRepository.findByPk(wishlistId);
        if (!wl) {
            throw new NotFoundException('Список не найден');
        }

        const updateData: any ={...dto};
        if ('eventDate' in dto) {
            updateData.eventDate = this.normalizeData(dto.eventDate as string);
        }

        if (dto.accesslevelId === 3 && !wl.shareToken) {
            updateData.shareToken = uuidv4();
        } else if (dto.accesslevelId !== 3) {
            updateData.shareToken = null;
        }

        await wl.update(updateData);
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
                if (userId === null) { 
                    return false;
                }
                const acceptedId = await this.getStatusId('accepted');
                const friendship = await this.friendRepository.findOne({
                    where : {
                        friendstatusId: acceptedId,
                        [Op.or]: [
                            {userid1: userId, userid2: wishlist.userId},
                            {userid1: wishlist.userId, userid2: userId}
                        ]
                    }
                });
                return !!friendship;
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

    async copyToList(userId: number, wishId: number, targetListId: number): Promise<void> {
        const link = await this.wishListWishRepository.findOne({where: {wishId}});
        if (!link) {
            throw new NotFoundException('Оригинальное желание не найдено ни в одном списке')
        }

        const originList = await this.wishListRepository.findByPk(link.wishlistId, {attributes: ['userId']});
        if (!originList) {
            throw new NotFoundException('Список не найден')
        }
        if (originList.userId !== userId) {
            throw new ForbiddenException('Копировать можно только свои желания')
        }
        if (!(await this.isOwner(userId, targetListId))) {
            throw new ForbiddenException('Нельзя копировать в чужой список')
        }

        const already = await this.wishListWishRepository.findOne({where: {wishId, wishlistId: targetListId}});
        if (already) {
            throw new ConflictException('Желание уже есть в целевом списке')
        }

        await this.wishListWishRepository.create({wishlistId: targetListId, wishId});
    }

    async searchFriendLists(requestId: number, friendId: number, nameSearch: string): Promise<WishList[]> {
        const acceptedId = await this.getStatusId('accepted');
        const friendship = await this.friendRepository.findOne({where: {friendstatusId: acceptedId, [Op.or]: [
            {userid1: requestId, userid2: friendId}, {userid1: friendId, userid2: requestId}
        ]}});
        if (!friendship) {
            throw new ForbiddenException('Вы не являетесь друзьями')
        }

        const lists = await this.wishListRepository.findAll({where: {userId: friendId, name: {[Op.iLike]: `%${nameSearch}%`}}, include: [{model: AccessLevel, as: 'accesslevel'}]});
        return lists;
    }

    async getFullById(userId: number | null, wishlistId: number, shareToken?: string): Promise <WishList> {
        if (!(await this.canAccessWishList(userId, wishlistId, shareToken))) {
            throw new ForbiddenException('Доступ к списку запрещен')
        }

        const wishlist = await this.wishListRepository.findByPk(wishlistId, {include: [
            {model: AccessLevel, as: 'accesslevel', attributes: ['id', 'name']},
            {model: User, as: 'user', attributes: ['id', 'login', 'fullName', 'email', 'image']},
            {model: Wish, as: 'wishes', through: {attributes: []}, include: [{model: WishStatus, attributes: ['id', 'name']}]}
        ]});

        if (!wishlist) {
            throw new NotFoundException('Список желаний не найден');
        }

        return wishlist
    }

}
