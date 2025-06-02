import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { WishService } from './wish.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { WishlistService } from 'src/wishlist/wishlist.service';
import { InjectModel } from '@nestjs/sequelize';
import { WishListWish } from 'src/wishlist/wishlist-wish.model';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishIdDto } from './dto/wish-id.dto';
import { FUllWIshDto } from './dto/full-wish.dto';
import { FriendService } from 'src/friend/friend.service';
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';
import { Wish } from './wish.model';

@Controller('wish')
export class WishController {

    constructor(private wishService: WishService, private wishlistService: WishlistService, private readonly friendService: FriendService, @InjectModel(WishListWish) private wishListWishRepository: typeof WishListWish) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image', {limits: {fileSize: 2 * 1024 * 1024}}))
    async createWishInList(@Body() dto: CreateWishDto, @UploadedFile() image: Express.Multer.File, @Req() req) {
        const userId = req.user.id;
        if (!(await this.wishlistService.isOwner(userId, dto.listId))) {
            throw new ForbiddenException('Только владелец списка может добавлять в него желания');
        }

        return this.wishService.createFullWish(dto, image, dto.listId, userId);
    }


    @UseGuards(JwtAuthGuard)
    @Get('all')
    async getAllWishesAdm(@Req() req, @Query('page') page = '1', @Query('limit') limit = '20') {
        if (req.user.roles?.value !== 'admin') {
            throw new ForbiddenException('У вас нет прав, чтобы посмотреть все желания')
        }
            
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const perPage = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
        const {rows, count} = await this.wishService.getAllWishesAdm(pageNum, perPage);
    
        const data = rows.map((w) => {return(w.get({plain: true}) as any) as Partial<Wish>});
    
        return {data, page: pageNum, perPage, total: count, totalPages: Math.ceil(count/perPage)};
    } 

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllWishes(@Req() req) {
        const userId = req.user.id;
        const ownLists = await this.wishlistService.getAllByUser(userId);
        const listIds = ownLists.map(l => l.id);
        return this.wishService.findAllFullByListIds(listIds, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('booked')
    async getBooked(@Req() req): Promise<FUllWIshDto[]> {
        const userId = req.user.id;

        return this.wishService.getBookedFullByUser(userId);
    }

    @UseGuards(OptionalJwtAuthGuard)
    @Get(':id')
    async getWIshById(@Param('id') wishId: number, @Req() req, @Query('token') shareToken?: string | undefined): Promise<FUllWIshDto & {canBook: boolean}> {
        const viewer = req.user;
        const viewerId: number | null = viewer?.id ?? null
        const isAdmin = viewer?.roles?.value === 'admin';
        const fullDto = isAdmin ? await this.wishService.getFullWishById(wishId, viewerId, shareToken, true) : await this.wishService.getFullWishById(wishId, viewerId, shareToken);
        const ownerId = fullDto.owner.id;
        let canBook = false;
        if (viewerId) {
            if (viewerId === ownerId) {
                canBook = true;
            } else {
                canBook = await this.friendService.areFriends(viewerId, ownerId)
            }
        }

        return {...fullDto, canBook}
    }
    

    @UseGuards(JwtAuthGuard)
    @Patch()
    @UseInterceptors(FileInterceptor('image', {limits: {fileSize: 2 * 1024 * 1024}}))
    async updateWish(@UploadedFile() image: Express.Multer.File, @Body() dto: UpdateWishDto, @Req() req): Promise<FUllWIshDto> {
        const userId = req.user.id;
        const {id} = dto;
        const record = await this.wishListWishRepository.findOne({where: {wishId: id}});
        if (!record) {
            throw new NotFoundException('Желание не найдено в списках')
        }

        const isOwner = await this.wishlistService.isOwner(userId, record.wishlistId);
        if (!isOwner && req.user.roles?.value != 'admin') {
            throw new ForbiddenException('Только владелец списка или администратор может редактировать желание')
        }

        return this.wishService.updateFullWish(id, dto, image, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteWish(@Param('id') wishId: number, @Req() req) {
        const userId = req.user.id;
        const userRole = req.user.roles?.value;
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
    async bookWish(@Body() dto: WishIdDto, @Req() req): Promise<FUllWIshDto> {
        const userId = req.user.id as number;
        const wishId = dto.id;

        const link = await this.wishListWishRepository.findOne({ where: { wishId } });
        if (!link) {
            throw new NotFoundException('Желание не найдено в списках');
        }

        const shareToken = req.query.token as string | undefined;
        const canSee = await this.wishlistService.canAccessWishList(userId, link.wishlistId, shareToken);
        if (!canSee) {
            throw new ForbiddenException('Нет доступа к бронироваю этого желания');
        }

        const wl = await this.wishlistService.findByIdWithAccess(link.wishlistId);
        if (!wl) {
            throw new NotFoundException('Список не найден');
        }

        const ownerId = wl.userId;
        const levelId = wl.accesslevelId;
        const PUBLIC_ID = 1;
        const FRIENDS_ID = 4;
        if (ownerId !== null && ownerId !== userId && (levelId === PUBLIC_ID || levelId === FRIENDS_ID)) {
            const areFriends = await this.friendService.areFriends(ownerId, userId);
            if (!areFriends) {
                throw new ForbiddenException('Бронировать можно только если вы в дружбе с владельцем списка');
            }
        }

        return this.wishService.bookFullWish(wishId, userId, shareToken);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('unbook')
    async unbookWish(@Body() dto: WishIdDto, @Req() req): Promise<FUllWIshDto> {
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

        return this.wishService.unbookFullWish(wishId, userId, shareToken);
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
   
        const wl = await this.wishlistService.findByIdWithAccess(record.wishlistId);
        if (!wl) {
            throw new NotFoundException('Список не найден');
        }

        return this.wishService.completeFullWish(wishId, userId);
    }
}