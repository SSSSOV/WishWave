import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './wish.model';
import { InjectModel } from '@nestjs/sequelize';
import { FileService } from 'src/file/file.service';
import { WishListWish } from 'src/wishlist/wishlist-wish.model';
import { WishStatus } from 'src/wishstatus/wishstatus.model';
import { WishList } from 'src/wishlist/wishlist.model';
import { User } from 'src/users/users.model';
import { WishlistService } from 'src/wishlist/wishlist.service';
import { ProfanityService } from 'src/profanity/profanity.service';
import { BookedByUserDto, FUllWIshDto, ListInfoDto, OwnerInfoDto } from './dto/full-wish.dto';
import { AccessLevel } from 'src/accesslevel/accesslevel.model';

@Injectable()
export class WishService {

    constructor(@InjectModel(Wish) private wishRepository: typeof Wish, 
    private fileService: FileService, 
    @InjectModel(WishListWish) private wishListWishRepository: typeof WishListWish,
    @InjectModel(WishStatus) private wishStatusRepository: typeof WishStatus,
    private readonly wishlistService: WishlistService,
    private readonly profanity: ProfanityService) {}

    async create(dto: CreateWishDto, image: any, listId: number) {
        let fileName: string | null = null;
        const textToCheck = [dto.name, dto.image ?? '', dto.productLink ?? ''];

        for (const txt of textToCheck) {
            if (this.profanity.containsProfanity(txt)) {
                throw new BadRequestException('В тексте найдены запрещенные слова')
            }
        }

        if(image) {
            fileName = await this.fileService.createFile(image);
        } else if (dto.image && dto.image.startsWith('http')) {
            fileName = await this.fileService.downloadImage(dto.image);
        }

        const data: any = {...dto};
        if (fileName) {
            data.image = fileName;
        }

        data.wishStatusId = 1;
        const wish = await this.wishRepository.create(data);

        await this.wishListWishRepository.create({wishlistId: listId, wishId: wish.id});

        return wish;
    }

    async createFullWish(dto: CreateWishDto, image: Express.Multer.File, listId: number, userId: number): Promise<FUllWIshDto> {
        const wish = await this.create(dto, image, listId);
        const wl = await this.wishlistService.getFullById(userId, listId);
        const pWl = wl.get({plain: true}) as any;
        const owner: OwnerInfoDto = {id: pWl.user.id, fullname: pWl.user.fullname, login: pWl.user.login, image: pWl.user.image};
        const list: ListInfoDto = {id: pWl.id, name: pWl.name, eventDate: pWl.eventDate, accessLevelId: pWl.accesslevelId};
        const shareToken = pWl.shareToken || null;
        const fullWish = await this.wishRepository.findByPk(wish.id, {include: [{model: User, as: 'bookedByUser', attributes: ['id', 'fullname', 'login', 'image']}]});
        const pWish = fullWish?.get({plain: true}) as any;
        const bookedByUser: BookedByUserDto | null = pWish.bookedByUser ? {id: pWish.bookedByUser.id, fullname: pWish.bookedByUser.fullname, login: pWish.bookedByUser.login, image: pWish.bookedByUser.image} : null;

        return {id: pWish.id, name: pWish.name, price: pWish.price, productLink: pWish.productLink, image: pWish.image, wishStatusId: pWish.wishStatusId, createdAt: pWish.createdAt, updatedAt: pWish.updatedAt, shareToken, owner, list, bookedByUser};
    }

    async findAllByListIds(listIds: number[]): Promise<Wish[]> {
        if (listIds.length === 0) return [];
        
        const links = await this.wishListWishRepository.findAll({where: {wishlistId: listIds}, attributes: ['wishId']});
        const wishIds = Array.from(new Set(links.map(link => link.wishId)));
        if (wishIds.length === 0) {
            return [];
        }

        return this.wishRepository.findAll({where: {id: wishIds}});
    }

    async findById(id: number): Promise<Wish> {
        const wish = await this.wishRepository.findByPk(id, {include: [{
            model: WishStatus,
            as: 'wishstuses',
            attributes: ['id']
      }]
    });
        if (!wish) {
            throw new NotFoundException(`Желание с id ${id} не было найдено`);
        }
        return wish;
    }

    async update(id: number, dto: Partial<CreateWishDto>, image?: Express.Multer.File): Promise<Wish> {
        const wish = await this.wishRepository.findByPk(id);
        if (!wish) {
            throw new NotFoundException(`Желание с id ${id} не было найдено`);
        }

        const textToCheck = [dto.name, dto.image, dto.productLink];
        for (const txt of textToCheck) {
            if (this.profanity.containsProfanity(txt)) {
                throw new BadRequestException('В тексте найдены запрещенные слова')
            }
        }

        const oldImage = wish.image;
        let filename: string | null = null;

        if (image) {
            filename = await this.fileService.createFile(image);
        } else if (dto.image && dto.image.startsWith('http')) {
            filename = await this.fileService.downloadImage(dto.image);
        }

        const updateData: any = {...dto};
        if(filename) {
            updateData.image = filename;
        } else {
            delete updateData.image;
        }

        await wish.update(updateData);
        if (oldImage && filename && oldImage !== filename) {
            await this.fileService.deleteFile(oldImage);
        }

        return wish;
    }

    async updateFullWish(id: number, dto: Partial<CreateWishDto>, image: Express.Multer.File, userId: number): Promise<FUllWIshDto> {
        const wish = await this.update(id, dto, image);
        const link = await this.wishListWishRepository.findOne({where: {wishId: wish.id}});
        if (!link) {
            throw new NotFoundException('Желание не найдено в списках')
        }

        const wl = await this.wishlistService.getFullById(userId, link.wishlistId);
        const pWl = wl.get({plain: true}) as any;
        const owner: OwnerInfoDto = {id: pWl.user.id, fullname: pWl.user.fullname, login: pWl.user.login, image: pWl.user.image};
        const list: ListInfoDto = {id: pWl.id, name: pWl.name, eventDate: pWl.eventDate, accessLevelId: pWl.accesslevelId};
        const shareToken = pWl.shareToken || null;
        const fullWish = await this.wishRepository.findByPk(wish.id, {include: [{model: User, as: 'bookedByUser', attributes: ['id', 'fullname', 'login', 'image']}]});
        const pWish = fullWish?.get({plain: true}) as any;
        const bookedByUser: BookedByUserDto | null = pWish.bookedByUser ? {id: pWish.bookedByUser.id, fullname: pWish.bookedByUser.fullname, login: pWish.bookedByUser.login, image: pWish.bookedByUser.image} : null;

        return {id: pWish.id, name: pWish.name, price: pWish.price, productLink: pWish.productLink, image: pWish.image, wishStatusId: pWish.wishStatusId, createdAt: pWish.createdAt, updatedAt: pWish.updatedAt, shareToken, owner, list, bookedByUser};
    }

    async delete(id: number): Promise<void> {
        const wish = await this.findById(id);
        const imageToDelete = wish.image;
        await wish.destroy();

        if (imageToDelete) {
            await this.fileService.deleteFile(imageToDelete);
        }
    }

    async bookWish(wishId: number, userId: number): Promise<Wish> {
        const wish = await this.findById(wishId);

        const completed = await this.wishStatusRepository.findOne({where: {name: 'completed'}});
        if (!completed) {
            throw new NotFoundException('Статус "completed" не найден')
        }
        if (wish.wishStatusId === completed.id) {
            throw new BadRequestException(`Желание с id ${wishId} уже завершено и не может быть забронировано`)
        }

        if (wish.bookedByUserId != null) {
            throw new BadRequestException(`Желание с id ${wishId} уже забронировано`);
        }

        wish.wishStatusId = 2;
        wish.bookedByUserId = userId;
        return await wish.save();
    }

    async bookFullWish (wishId: number, userId: number, shareToken?: string): Promise<FUllWIshDto> {
        const bookedWish = await this.bookWish(wishId, userId);
        const link = await this.wishListWishRepository.findOne({where: {wishId}});
        if (!link) {
            throw new NotFoundException('Желание не найдено в списках')
        }

        const wl = await this.wishlistService.getFullById(userId, link.wishlistId);
        const pWl = wl.get({plain: true}) as any;
        const owner: OwnerInfoDto = {id: pWl.user.id, fullname: pWl.user.fullname, login: pWl.user.login, image: pWl.user.image};
        const list: ListInfoDto = {id: pWl.id, name: pWl.name, eventDate: pWl.eventDate, accessLevelId: pWl.accesslevelId};
        const realShareToken = pWl.shareToken || null;
        const fullWish = await this.wishRepository.findByPk(wishId, {include: [{model: User, as: 'bookedByUser', attributes: ['id', 'fullname', 'login', 'image']}]});
        const pWish = fullWish?.get({plain: true}) as any;
        const bookedByUser: BookedByUserDto | null = pWish.bookedByUser ? {id: pWish.bookedByUser.id, fullname: pWish.bookedByUser.fullname, login: pWish.bookedByUser.login, image: pWish.bookedByUser.image} : null;

        return {id: pWish.id, name: pWish.name, price: pWish.price, productLink: pWish.productLink, image: pWish.image, wishStatusId: pWish.wishStatusId, createdAt: pWish.createdAt, updatedAt: pWish.updatedAt, shareToken: realShareToken, owner, list, bookedByUser};
    }

    async unbookWish(wishId: number, userId: number): Promise<Wish> {
        const wish = await this.findById(wishId);
        if (wish.bookedByUserId == null) {
            throw new BadRequestException(`Желание с id ${wishId} не забронировано или бронь уже снята`);
        }

        const link = await this.wishListWishRepository.findOne({where: {wishId}});
        if (!link) {
            throw new NotFoundException('Желание не найдено ни в одном списке')
        }

        const isListOwner = await this.wishlistService.isOwner(userId, link.wishlistId);
        if (wish.bookedByUserId !== userId && !isListOwner) {
            throw new BadRequestException(`Вы не можете снять бронь, т.к. не являетесь её владельцем или владельцем списка`);
        }

        wish.wishStatusId = 1;
        wish.bookedByUserId = null;
        return await wish.save();
    }

    async unbookFullWish (wishId: number, userId: number, shareToken?: string): Promise<FUllWIshDto> {
        const unbooked = await this.unbookWish(wishId, userId);
        const link = await this.wishListWishRepository.findOne({where: {wishId}});
        if (!link) {
            throw new NotFoundException('Желание не найдено в списках')
        }

        const wl = await this.wishlistService.getFullById(userId, link.wishlistId);
        const pWl = wl.get({plain: true}) as any;
        const owner: OwnerInfoDto = {id: pWl.user.id, fullname: pWl.user.fullname, login: pWl.user.login, image: pWl.user.image};
        const list: ListInfoDto = {id: pWl.id, name: pWl.name, eventDate: pWl.eventDate, accessLevelId: pWl.accesslevelId};
        const realShareToken = pWl.shareToken || null;
        const fullWish = await this.wishRepository.findByPk(wishId, {include: [{model: User, as: 'bookedByUser', attributes: ['id', 'fullname', 'login', 'image']}]});
        const pWish = fullWish?.get({plain: true}) as any;
        const bookedByUser: BookedByUserDto | null = pWish.bookedByUser ? {id: pWish.bookedByUser.id, fullname: pWish.bookedByUser.fullname, login: pWish.bookedByUser.login, image: pWish.bookedByUser.image} : null;

        return {id: pWish.id, name: pWish.name, price: pWish.price, productLink: pWish.productLink, image: pWish.image, wishStatusId: pWish.wishStatusId, createdAt: pWish.createdAt, updatedAt: pWish.updatedAt, shareToken: realShareToken, owner, list, bookedByUser};
    }

    async getBookedWishes(userId: number): Promise<Wish[]> {
        const wishes = await this.wishRepository.findAll({
            where: {bookedByUserId: userId},
            include: [
                {model: WishStatus, attributes: ['id', 'name']},
                {model: WishList, through: {attributes: []}, 
                include:[
                    {model: User, attributes: ['id', 'login', 'fullname', 'email', 'image']}
                ]}
            ]
        })
        return wishes;
    }

    async getBookedFullByUser(userId: number): Promise<FUllWIshDto[]> {
        const wishes = await this.wishRepository.findAll({where: {bookedByUserId: userId}, include: [{model: WishStatus, attributes: ['id', 'name']}, {
            model: WishList, through: {attributes: []}, include: [{model: AccessLevel, as: 'accesslevel', attributes: ['id', 'name']}, {
                model: User, as: 'user', attributes: ['id', 'fullname', 'login', 'image']}]},{
                    model: User, as: 'bookedByUser', attributes: ['id', 'fullname', 'login', 'image']}]});

        return wishes.map(w => {const p = (w as any).get({plain: true});
            const wl = p.wishlists[0] as any;
            const owner: OwnerInfoDto = {id: wl.user.id, fullname: wl.user.fullname, login: wl.user.login, image: wl.user.image};
            const list: ListInfoDto = {id: wl.id, name: wl.name, eventDate: wl.eventDate, accessLevelId: wl.accesslevelId};
            const bookedByUser: BookedByUserDto | null = p.bookedByUser ? {id: p.bookedByUser.id, fullname: p.bookedByUser.fullname, login: p.bookedByUser.login, image: p.bookedByUser.image} : null;
                return {id: p.id, name: p.name, price: p.price, productLink: p.productLink, image: p.image, wishStatusId: p.wishStatusId, createdAt: p.createdAt, updatedAt: p.updatedAt, shareToken: wl.shareToken ?? null, owner, list, bookedByUser} as FUllWIshDto
        })
    }

    async completeWish(wishId: number, userId: number): Promise<Wish> {
        const link = await this.wishListWishRepository.findOne({where: {wishId}});
        if (!link) {
            throw new NotFoundException('Желание не найдено ни в одном списке')
        }

        const isOwner = await this.wishlistService.isOwner(userId, link.wishlistId);
        if (!isOwner) {
            throw new ForbiddenException('Только владелец списка может завершать желания')
        }

        const wish = await this.wishRepository.findByPk(wishId);
        if(!wish) {
            throw new NotFoundException(`Желание с id ${wishId} не найдено`)
        }

        const completedStatus = await this.wishStatusRepository.findOne({where: {name: 'completed'}});
        if (!completedStatus) {
            throw new NotFoundException('Статус "completed" не найден ')
        }
        if (wish.wishStatusId === completedStatus.id) {
            throw new BadRequestException('Желание уже завершено')
        }

        wish.wishStatusId = completedStatus.id;
        return wish.save();
    }

    async completeFullWish(wishId, userId, shareToken?: string): Promise<FUllWIshDto> {
        await this.completeWish(wishId, userId);
        const link = await this.wishListWishRepository.findOne({where: {wishId}});
        if (!link) {
            throw new NotFoundException('Желание не найдено в списках')
        }

        const wl = await this.wishlistService.getFullById(userId, link.wishlistId);
        const pWl = wl.get({plain: true}) as any;
        const owner: OwnerInfoDto = {id: pWl.user.id, fullname: pWl.user.fullname, login: pWl.user.login, image: pWl.user.image};
        const list: ListInfoDto = {id: pWl.id, name: pWl.name, eventDate: pWl.eventDate, accessLevelId: pWl.accesslevelId};
        const realShareToken = pWl.shareToken || null;
        const fullWish = await this.wishRepository.findByPk(wishId, {include: [{model: User, as: 'bookedByUser', attributes: ['id', 'fullname', 'login', 'image']}]});
        const pWish = fullWish?.get({plain: true}) as any;
        const bookedByUser: BookedByUserDto | null = pWish.bookedByUser ? {id: pWish.bookedByUser.id, fullname: pWish.bookedByUser.fullname, login: pWish.bookedByUser.login, image: pWish.bookedByUser.image} : null;

        return {id: pWish.id, name: pWish.name, price: pWish.price, productLink: pWish.productLink, image: pWish.image, wishStatusId: pWish.wishStatusId, createdAt: pWish.createdAt, updatedAt: pWish.updatedAt, shareToken: realShareToken, owner, list, bookedByUser};
    }

    async getFullWishById(wishId, userId, shareToken?: string): Promise<FUllWIshDto> {
        const link = await this.wishListWishRepository.findOne({where: {wishId}});
        if (!link) {
            throw new NotFoundException('Желание не найдено в списках')
        }

        const wl = await this.wishlistService.getFullById(userId, link.wishlistId, shareToken);
        const pWl = wl.get({plain: true}) as any;
        const owner: OwnerInfoDto = {id: pWl.user.id, fullname: pWl.user.fullname, login: pWl.user.login, image: pWl.user.image};
        const list: ListInfoDto = {id: pWl.id, name: pWl.name, eventDate: pWl.eventDate, accessLevelId: pWl.accesslevelId};
        const realShareToken = pWl.shareToken || null;
        const fullWish = await this.wishRepository.findByPk(wishId, {include: [{model: User, as: 'bookedByUser', attributes: ['id', 'fullname', 'login', 'image']}]});
        const pWish = fullWish?.get({plain: true}) as any;
        const bookedByUser: BookedByUserDto | null = pWish.bookedByUser ? {id: pWish.bookedByUser.id, fullname: pWish.bookedByUser.fullname, login: pWish.bookedByUser.login, image: pWish.bookedByUser.image} : null;

        return {id: pWish.id, name: pWish.name, price: pWish.price, productLink: pWish.productLink, image: pWish.image, wishStatusId: pWish.wishStatusId, createdAt: pWish.createdAt, updatedAt: pWish.updatedAt, shareToken: realShareToken, owner, list, bookedByUser};
    }

    async findAllFullByListIds(listIds: number[], userId: number): Promise<FUllWIshDto[]> {
        const links = await this.wishListWishRepository.findAll({where: {wishlistId: listIds}, attributes: ['wishId']});
        const wishIds = Array.from(new Set(links.map(l => l.wishId)));

        return Promise.all(wishIds.map(wid => this.getFullWishById(wid, userId)));
    }
}
