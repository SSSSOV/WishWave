import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WishList } from './wishlist.model';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Wish } from 'src/wish/wish.model';
import { AccessLevel } from 'src/accesslevel/accesslevel.model';
import { User } from 'src/users/users.model';
import { WhereOptions, Op as SqOp, FindAndCountOptions} from 'sequelize';
import { Friend } from 'src/friend/friend.model';
import { FriendStatus } from 'src/friendstatus/friendstatus.model';
import { v4 as uuidv4 } from 'uuid';
import { WishStatus } from 'src/wishstatus/wishstatus.model';
import { WishListWish } from './wishlist-wish.model';
import { ProfanityService } from 'src/profanity/profanity.service';

@Injectable()
export class WishlistService {
    constructor(@InjectModel(WishList) private wishListRepository: typeof WishList, 
        @InjectModel(Friend) private friendRepository: typeof Friend, 
        @InjectModel(Wish) private wishRepository: typeof Wish,
        @InjectModel(WishListWish) private wishListWishRepository: typeof WishListWish,
        @InjectModel(FriendStatus) private statusRepository: typeof FriendStatus,
        private readonly profanity: ProfanityService) {}

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

    async create(dto: CreateWishlistDto, userId: number | null, listId?: number) {
        let shareToken: string | null = null;
        
        if (this.profanity.containsProfanity(dto.name) || (dto.description && this.profanity.containsProfanity(dto.description))) {
            throw new BadRequestException('В тексте найдены запрещенные слова')
        }

        dto.eventDate = this.normalizeData(dto.eventDate);

        if (userId === null) {
            dto.accesslevelId = 1;
            shareToken = uuidv4();
        }

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

        if (dto.name && this.profanity.containsProfanity(dto.name)) {
            throw new BadRequestException('В тексте найдены запрещенные слова')
        }
        if (dto.description && this.profanity.containsProfanity(dto.description)) {
            throw new BadRequestException('В тексте найдены запрещенные слова')
        }

        const updateData: any ={...dto};
        if ('eventDate' in dto) {
            updateData.eventDate = this.normalizeData(dto.eventDate as string);
        }

        if ('accesslevelId' in dto) {
            if (dto.accesslevelId === 3 && !wl.shareToken) {
                updateData.shareToken = uuidv4();
            } else if (dto.accesslevelId !== 3) {
                updateData.shareToken = null;
            }
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

        const plain = wishlist.get({plain: true}) as{
            id:number;
            shareToken?: string;
            accesslevel: {name: string};
        };

        if (shareToken && plain.shareToken === shareToken) {
            return true;
        }
        if (userId !== null && wishlist.userId === userId) {
            return true;
        }


        if(!plain.accesslevel) {
            throw new NotFoundException('Не найден уровень доступа для этого списка');
        }

        const level = plain.accesslevel.name;
        switch (level) {
            case 'public':
                return true;
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
                        [SqOp.or]: [
                            {sender: userId, recipient: wishlist.userId},
                            {sender: wishlist.userId, recipient: userId}
                        ] as WhereOptions<Friend> []
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
        const friendship = await this.friendRepository.findOne({where: {friendstatusId: acceptedId, [SqOp.or]: [
            {sender: requestId, recipient: friendId}, {sender: friendId, recipient: requestId}
        ]}});
        if (!friendship) {
            throw new ForbiddenException('Вы не являетесь друзьями')
        }

        const lists = await this.wishListRepository.findAll({where: {userId: friendId, name: {[SqOp.iLike]: `%${nameSearch}%`}}, include: [{model: AccessLevel, as: 'accesslevel'}]});
        return lists;
    }

    async getFullById(userId: number | null, wishlistId: number, shareToken?: string): Promise <WishList> {
        if (!(await this.canAccessWishList(userId, wishlistId, shareToken))) {
            throw new ForbiddenException('Доступ к списку запрещен')
        }

        const wishlist = await this.wishListRepository.findByPk(wishlistId, {include: [
            {model: AccessLevel, as: 'accesslevel', attributes: ['id', 'name']},
            {model: User, as: 'user', attributes: ['id', 'login', 'fullname', 'email', 'image']},
            {model: Wish, as: 'wishes', through: {attributes: []}, include: [{model: WishStatus, attributes: ['id', 'name']}, {
                model: User, as: 'bookedByUser', attributes: ['id', 'fullname', 'login', 'image']}]}
        ]});

        if (!wishlist) {
            throw new NotFoundException('Список желаний не найден');
        }

        return wishlist
    }


    async canEditWishList(wishlistId: number, userId: number | null, shareToken?: string): Promise<boolean> {
        const wl = await this.wishListRepository.findByPk(wishlistId, {attributes: ['userId', 'shareToken']});
        if (!wl) {
            throw new NotFoundException('Список не найден')
        }

        const plain = wl.get({ plain: true });
            console.log('canEditWishList:', {
            fromDb: plain.shareToken,
            fromClient: shareToken
        });
        const {userId: ownerId, shareToken: realToken} = wl.get({plain: true});
        if (userId !== null && userId === ownerId) {
            return true
        }

        if (shareToken && shareToken === realToken) {
            return true
        }

        return false;
    }

    async getAccessibleWishes(viewerId: number, ownerId: number): Promise<WishList[]> {
        const allLists = await this.wishListRepository.findAll({where: {userId: ownerId}, attributes: ['id', 'shareToken', 'userId'], include: [{model: AccessLevel, as: 'accesslevel', attributes: ['name']}]});
        const acceptedStatusId = await this.getStatusId('accepted');
        const accessibleListIds: number[] = [];
        for (const wl of allLists) {
            const plain = wl.get({plain:true}) as any;
            const {id} = plain;
            const lvl = plain.accesslevel.name;

            if (ownerId === viewerId) {
                accessibleListIds.push(id);
            } else if (lvl === 'public') {
                accessibleListIds.push(id);
            } else if (lvl === 'friends') {
                const friendship = await this.friendRepository.findOne({where: {friendstatusId: acceptedStatusId, [SqOp.or]: [
                    {sender: viewerId, recipient: ownerId}, {sender: ownerId, recipient: viewerId}
                ]}});
    
                if(friendship) {
                    accessibleListIds.push(id);
                }
            } 
        }


        if (accessibleListIds.length === 0) {
            return [];
        }

        return this.wishListRepository.findAll({where: {id: accessibleListIds}, attributes: ['id', 'name', 'accesslevelId', 'description', 'eventDate', 'shareToken'], include: [{model: User, as: 'user', attributes: ['id', 'fullname', 'login', 'image']}]});
    }

    async findByIdBare(wishlistId: number): Promise<WishList | null> {
        return this.wishListRepository.findByPk(wishlistId, {include: [ { model: AccessLevel, as: 'accesslevel', attributes: ['id', 'name'] },
            { model: User, as: 'user', attributes: ['id', 'fullname', 'login', 'image'] }]})
    }

    async getAllWishlistAdm(page: number, perPage: number) {
        const offset = (page - 1) * perPage;
        const options: FindAndCountOptions = {attributes: ['id','name','description','eventDate','shareToken','userId','accesslevelId','createdAt','updatedAt'], limit: perPage, offset, order: [['id', 'ASC']]};

        return this.wishListRepository.findAndCountAll(options);
    }
}
