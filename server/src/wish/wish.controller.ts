import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Wish } from './wish.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { WishlistService } from 'src/wishlist/wishlist.service';
import { InjectModel } from '@nestjs/sequelize';
import { WishListWish } from 'src/wishlist/wishlist-wish.model';
import { BookedWishDto } from './dto/booked-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishIdDto } from './dto/wish-id.dto';
import { OmitType } from '@nestjs/swagger';

@Controller('wish')
export class WishController {

    constructor(private wishService: WishService, private wishlistService: WishlistService, @InjectModel(WishListWish) private wishListWishRepository: typeof WishListWish) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image', {limits: {fileSize: 2 * 1024 * 1024}}))
    async createWishInList(@Body() dto: CreateWishDto, @UploadedFile() image: Express.Multer.File, @Req() req) {
        const userId = req.user.id;
        if (!(await this.wishlistService.isOwner(userId, dto.listId))) {
            throw new ForbiddenException('Только владелец списка может добавлять в него желания');
        }

        const wish = await this.wishService.create(dto, image, dto.listId);
        const wl = await this.wishlistService.findByIdWithAccess(dto.listId);
        const {shareToken} = wl?.get({plain: true}) as any;

        const wishPlain = wish.get({plain: true}) as any;
        return {...wishPlain, shareToken, userId};
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllWishes(@Req() req) {
        const userId = req.user.id;
        const ownLists = await this.wishlistService.getAllByUser(userId);
        const listIds = ownLists.map(l => l.id);
        return this.wishService.findAllByListIds(listIds);
    }

    @UseGuards(JwtAuthGuard)
    @Get('booked')
    async getBooked(@Req() req): Promise<BookedWishDto[]> {
        const userId = req.user.id;
        const wishes = await this.wishService.getBookedWishes(userId)

        return wishes.map(w => {const p: any = w.get({plain:true}); const lists = Array.isArray(p.wishlists) ? p.wishlists.map((l: any) => ({id: l.id, name: l.name, userId: l.userId, shareToken: l.shareToken})): [];
            return {id: p.id, name: p.name, price: p.price, image: p.image, productLink: p.productLink, bookedByUserId: p.bookedByUserId, wishlists: lists} as BookedWishDto;}); 
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getWIshById(@Param('id') wishId: number, @Query('token') token: string | undefined, @Req() req): Promise<any> {
        const link = await this.wishListWishRepository.findOne({where: {wishId}});
        if (!link) {
            throw new NotFoundException('Желание не найдено ни в одном списке')
        }
        
        const can = await this.wishlistService.canAccessWishList(req.user.id, link.wishlistId, );
        if (!can) {
            throw new ForbiddenException('Доступ к желанию запрещен')
        }
        
        const wish = await this.wishService.findById(wishId);
        const wl = await this.wishlistService.findByIdWithAccess(link.wishlistId);
        if (!wl) {
            throw new NotFoundException('Список не найден');
        }
        const {userId, shareToken} = wl.get({plain: true}) as any;
        const plainWish = wish.get({plain: true}) as any;

        return{id: plainWish.id, name: plainWish.name, price: plainWish.price, image: plainWish.image, productLink: plainWish.productLink, wishStatusId: plainWish.wishstuses.id, bookedByUserId: plainWish.bookedByUserId, createdAt: plainWish.createdAt, updatedAt: plainWish.updatedAt, userId, shareToken};
    }
    

    @UseGuards(JwtAuthGuard)
    @Patch()
    @UseInterceptors(FileInterceptor('image', {limits: {fileSize: 2 * 1024 * 1024}}))
    async updateWish(@UploadedFile() image: Express.Multer.File, @Body() dto: UpdateWishDto, @Req() req): Promise<any> {
        const userId = req.user.id;
        const {id: wishId, ...wishData} = dto;
        const record = await this.wishListWishRepository.findOne({where: {wishId}});
        if (!record) {
            throw new NotFoundException('Желание не найдено в списках')
        }

        if (!(await this.wishlistService.isOwner(userId, record.wishlistId))) {
            throw new ForbiddenException('Только владелец может редактировать желание')
        }

        const updated = await this.wishService.update(wishId, dto, image);
        const wl = await this.wishlistService.findByIdWithAccess(record.wishlistId);
        if (!wl) {
            throw new NotFoundException('Список не найден')
        }
        const {userId: ownerId, shareToken} = wl.get({plain:true}) as any;
        const w = (updated.get({plain: true}) as any); 

        return{id: w.id, name: w.name, price: w.price, image: w.image, productLink: w.productLink, wishStatusId: w.wishStatusId, bookedByUserId: w.bookedByUserId, createdAt: w.createdAt, updatedAt: w.updatedAt, userId: ownerId, shareToken};
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async deleteWish(@Body() dto: WishIdDto, @Req() req) {
        const userId = req.user.id;
        const userRole = req.user.roles?.value;
        const wishId = dto.id;
        const record = await this.wishListWishRepository.findOne({where: {wishId}});
        if (!record) {
            throw new NotFoundException('Желание не найдено в списках')
        }

        const isOwner = await this.wishlistService.isOwner(userId, record.wishlistId);
        if (!isOwner && userRole !== 'admin') {
            throw new ForbiddenException('Только владелец может удалять желание')
        }

        await this.wishService.delete(wishId);
        return {message: `Желание c id ${wishId} успешно удалено`};
    }

    @UseGuards(JwtAuthGuard)
    @Patch('book')
    async bookWish(@Body() dto: WishIdDto,@Req() req): Promise<any> {
        const userId = req.user['id'];
        const wishId = dto.id;
        const record = await this.wishListWishRepository.findOne({where: {wishId}});
        if (!record) {
            throw new NotFoundException('Желание не найдено в списках');
        }
        
        const shareToken = req.query.token as string | undefined;
        const can = await this.wishlistService.canAccessWishList(userId, record.wishlistId, shareToken);
        if (!can) {
            throw new ForbiddenException('Нет доступа к бронироваю этого желания');
        }

        const bookedWish = await this.wishService.bookWish(wishId, userId);
        const wl = await this.wishlistService.findByIdWithAccess(record.wishlistId);
        if (!wl) {
            throw new NotFoundException('Список не найден');
        }

        const {shareToken: realToken, userId: ownerId} = wl.get({plain: true}) as any;
        const w = bookedWish.get({plain: true}) as any;
        return {id: w.id, name: w.name, price: w.price, productLink: w.productLink,image: w.image, wishStatusId: w.wishStatusId, bookedByUserId: w.bookedByUserId, createdAt: w.createdAt, updatedAt: w.updatedAt, shareToken: realToken, userId: ownerId}
    }

    @UseGuards(JwtAuthGuard)
    @Patch('unbook')
    async unbookWish(@Body() dto: WishIdDto, @Req() req): Promise<any> {
        const userId = req.user?.id ?? null;
        const wishId = dto.id;
        const record = await this.wishListWishRepository.findOne({where: {wishId}});
        if(!record) {
            throw new NotFoundException('Желание не найдено в списках');
        }

        const shareToken = req.query.token as string | undefined;
        const can = await this.wishlistService.canAccessWishList(userId, record.wishlistId, shareToken);
        if (!can) {
            throw new ForbiddenException('Нет доступа к бронироваю этого желания');
        } 

        const unbookedWish = await this.wishService.unbookWish(wishId, userId);
        const wl = await this.wishlistService.findByIdWithAccess(record.wishlistId);
        if (!wl) {
            throw new NotFoundException('Список не найден');
        }

        const {shareToken: realToken, userId: ownerId} = wl.get({plain: true}) as any;
        const w = unbookedWish.get({plain: true}) as any;
        return {id: w.id, name: w.name, price: w.price, productLink: w.productLink,image: w.image, wishStatusId: w.wishStatusId, bookedByUserId: w.bookedByUserId, createdAt: w.createdAt, updatedAt: w.updatedAt, shareToken: realToken, userId: ownerId}
    }

    @UseGuards(JwtAuthGuard)
    @Patch('complete')
    async  complete(@Body() dto: WishIdDto, @Req() req) {
        const userId = req.user.id;
        const wishId = dto.id;
        const record = await this.wishListWishRepository.findOne({where: {wishId}});
        if (!record) {
            throw new NotFoundException('Желание не найдено в списках')
        }

        const isOwner = await this.wishlistService.isOwner(userId, record.wishlistId);
        if (!isOwner) {
            throw new ForbiddenException('Только владелец может завершать желания')
        }
   
        const completeWish = await this.wishService.completeWish(wishId, userId);
        const wl = await this.wishlistService.findByIdWithAccess(record.wishlistId);
        if (!wl) {
            throw new NotFoundException('Список не найден');
        }

        const {shareToken} = wl.get({plain: true}) as any;
        const plainWish = completeWish.get({plain: true}) as any;

        return {id: plainWish.id, name: plainWish.name, price: plainWish.price, productLink: plainWish.productLink,image: plainWish.image, wishStatusId: plainWish.wishStatusId, bookedByUserId: plainWish.bookedByUserId, createdAt: plainWish.createdAt, updatedAt: plainWish.updatedAt, shareToken, userId}
    }
}